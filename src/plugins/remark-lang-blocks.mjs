import { visit } from 'unist-util-visit';

/**
 * Turns `:::en` / `:::ko` container directives into
 * `<div class="lang-block lang-en">` / `<div class="lang-block lang-ko">`
 * so posts can carry both languages and the layout can toggle them.
 */
export function remarkLangBlocks() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' &&
        (node.name === 'en' || node.name === 'ko')
      ) {
        node.data = node.data || {};
        node.data.hName = 'div';
        node.data.hProperties = {
          className: ['lang-block', `lang-${node.name}`],
        };
      }
    });
  };
}
