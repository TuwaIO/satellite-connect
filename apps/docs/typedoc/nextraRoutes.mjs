// @ts-check
/**
 * @file TypeDoc plugin that adapts generated Markdown links to Nextra routes.
 *
 * With `entryFileName: "index"` every package overview is written to `<package>/index.md`, but Nextra serves
 * such a page at the folder URL (`/packages/orbit-core`), not at `/packages/orbit-core/index`. This plugin
 * rewrites links that point at an `index.md` file to the folder route so they resolve on the docs site.
 */

import { MarkdownPageEvent } from 'typedoc-plugin-markdown';

/** Matches Markdown link targets ending in `/index.md`, with an optional hash fragment. */
const INDEX_LINK_PATTERN = /\]\(([^)\s]*?)\/index\.md(#[^)\s]*)?\)/g;

/**
 * Rewrites Markdown links to `index.md` files so they target the containing folder route.
 *
 * @param {string} contents - Generated Markdown of a page.
 * @returns {string} Markdown with `.../index.md` links replaced by `...` (the fragment is kept).
 */
export function rewriteIndexLinks(contents) {
  return contents.replace(INDEX_LINK_PATTERN, (_match, path, hash = '') => `](${path || '/'}${hash})`);
}

/**
 * TypeDoc plugin entry point. Side effect: mutates the contents of every rendered Markdown page.
 *
 * @param {import('typedoc').Application} app - TypeDoc application instance.
 * @returns {void}
 */
export function load(app) {
  app.renderer.on(MarkdownPageEvent.END, (page) => {
    if (page.contents) page.contents = rewriteIndexLinks(page.contents);
  });
}
