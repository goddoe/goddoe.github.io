import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'blog');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const ADMIN_HTML = path.join(__dirname, 'admin.html');

const ID_RE = /^[a-z0-9][a-z0-9-]*$/;

function slugify(title) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-|-$/g, '');
  // Korean-only titles produce non-ascii slugs; fall back to a date slug.
  return ID_RE.test(slug) ? slug : `post-${Date.now()}`;
}

function safePostPath(id) {
  if (!ID_RE.test(id)) return null;
  return path.join(POSTS_DIR, `${id}.md`);
}

function readBody(req, limit = 30 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('payload too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function json(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(obj));
}

function listPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const id = f.replace(/\.md$/, '');
      try {
        const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8');
        const { data } = matter(raw);
        const d = data.date ? new Date(data.date) : null;
        return {
          id,
          title: data.title || id,
          date: d && !isNaN(d) ? d.toISOString() : '',
          draft: Boolean(data.draft),
        };
      } catch {
        return { id, title: id, date: '', draft: false };
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function newPostTemplate(title) {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  return `---
title: "${title.replace(/"/g, '\\"')}"
date: ${date}
description: ""
tags: []
draft: true
---

Write here.
`;
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;

  // Editor UI
  if (p === '/admin' || p === '/admin/') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(fs.readFileSync(ADMIN_HTML, 'utf-8'));
    return true;
  }

  if (!p.startsWith('/admin/api/')) return false;

  try {
    // GET /admin/api/posts
    if (p === '/admin/api/posts' && req.method === 'GET') {
      json(res, 200, listPosts());
      return true;
    }

    // POST /admin/api/posts  {title}
    if (p === '/admin/api/posts' && req.method === 'POST') {
      const body = JSON.parse((await readBody(req)).toString('utf-8'));
      const title = (body.title || '').trim() || 'Untitled';
      let id = body.id ? String(body.id) : slugify(title);
      if (!ID_RE.test(id)) {
        json(res, 400, { error: 'invalid id (use a-z, 0-9, hyphen)' });
        return true;
      }
      let file = safePostPath(id);
      let n = 2;
      while (fs.existsSync(file)) {
        id = `${id}-${n++}`;
        file = safePostPath(id);
      }
      fs.mkdirSync(POSTS_DIR, { recursive: true });
      fs.writeFileSync(file, newPostTemplate(title), 'utf-8');
      json(res, 200, { id });
      return true;
    }

    // /admin/api/posts/:id
    const postMatch = p.match(/^\/admin\/api\/posts\/([^/]+)$/);
    if (postMatch) {
      const id = decodeURIComponent(postMatch[1]);
      const file = safePostPath(id);
      if (!file) {
        json(res, 400, { error: 'invalid id' });
        return true;
      }
      if (req.method === 'GET') {
        if (!fs.existsSync(file)) {
          json(res, 404, { error: 'not found' });
          return true;
        }
        json(res, 200, { id, content: fs.readFileSync(file, 'utf-8') });
        return true;
      }
      if (req.method === 'PUT') {
        const body = JSON.parse((await readBody(req)).toString('utf-8'));
        if (typeof body.content !== 'string') {
          json(res, 400, { error: 'content required' });
          return true;
        }
        fs.mkdirSync(POSTS_DIR, { recursive: true });
        fs.writeFileSync(file, body.content, 'utf-8');
        json(res, 200, { ok: true });
        return true;
      }
      if (req.method === 'DELETE') {
        if (fs.existsSync(file)) fs.unlinkSync(file);
        json(res, 200, { ok: true });
        return true;
      }
    }

    // POST /admin/api/upload  {id, filename, data(base64)}
    if (p === '/admin/api/upload' && req.method === 'POST') {
      const body = JSON.parse((await readBody(req)).toString('utf-8'));
      const id = String(body.id || '');
      if (!ID_RE.test(id)) {
        json(res, 400, { error: 'invalid post id' });
        return true;
      }
      const original = String(body.filename || 'image.png');
      const ext = (path.extname(original) || '.png').toLowerCase();
      if (!/^\.(png|jpe?g|gif|webp|svg|avif)$/.test(ext)) {
        json(res, 400, { error: 'unsupported image type' });
        return true;
      }
      const base = path
        .basename(original, path.extname(original))
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, '-')
        .replace(/^-|-$/g, '') || 'image';
      const dir = path.join(IMAGES_DIR, id);
      fs.mkdirSync(dir, { recursive: true });
      let name = `${base}${ext}`;
      let n = 2;
      while (fs.existsSync(path.join(dir, name))) {
        name = `${base}-${n++}${ext}`;
      }
      fs.writeFileSync(path.join(dir, name), Buffer.from(body.data, 'base64'));
      json(res, 200, { path: `/images/${id}/${name}` });
      return true;
    }

    json(res, 404, { error: 'not found' });
    return true;
  } catch (err) {
    json(res, 500, { error: String(err && err.message ? err.message : err) });
    return true;
  }
}

/** Dev-only markdown editor served at /admin on the Astro dev server. */
export function editorPlugin() {
  return {
    name: 'sj-blog-editor',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        handle(req, res).then((handled) => {
          if (!handled) next();
        }, next);
      });
    },
  };
}
