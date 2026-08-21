// @ts-check
import { defineConfig } from 'astro/config';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkLangBlocks } from './src/plugins/remark-lang-blocks.mjs';
import { editorPlugin } from './tools/editor-plugin.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://goddoe.github.io',
  base: '/',
  markdown: {
    remarkPlugins: [remarkDirective, remarkLangBlocks, remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'github-light',
      wrap: false,
    },
  },
  vite: {
    plugins: [editorPlugin()],
  },
});
