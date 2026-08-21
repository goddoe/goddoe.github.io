# sj-blog

Academic, minimal blog built with [Astro](https://astro.build). Times New Roman, markdown posts, KaTeX math, and a built-in local web editor.

## Writing

```bash
npm run dev
```

- Blog: http://localhost:4321/
- **Editor: http://localhost:4321/admin**

The editor is dev-only (it never ships to the deployed site). It can:

- Create / edit / delete posts (markdown files in `src/content/blog/`)
- Auto-save while you type, live preview of the real rendered page
- Attach images by **drag & drop or paste** — saved to `public/images/<post-id>/` and inserted as markdown

## Post format

Posts are plain markdown files in `src/content/blog/<id>.md`. The filename is the URL: `/blog/<id>/`.

```markdown
---
title: "My Post"
date: 2026-08-21
description: "Optional one-line summary shown on the index."
tags: [Research]
draft: true        # drafts show locally but are excluded from the deployed site
---

Body in markdown. Math works: $e^{i\pi} + 1 = 0$, and display math with $$...$$.
```

### Bilingual posts (EN/KO toggle)

Wrap each language in a directive block; the post page automatically shows an EN | KO toggle:

```markdown
:::en

English text.

:::

:::ko

한국어 텍스트.

:::
```

## Deploying (GitHub Pages)

The included workflow (`.github/workflows/deploy.yml`) builds and deploys on every push to `main`.

1. Push this repo to GitHub (e.g. `goddoe/goddoe.github.io`).
2. In the repo settings → Pages → set **Source: GitHub Actions**.
3. If the repo is *not* named `goddoe.github.io`, set `base: '/<repo-name>'` and adjust `site` in `astro.config.mjs`.

## Build

```bash
npm run build     # output in dist/
npm run preview   # preview the production build
```
