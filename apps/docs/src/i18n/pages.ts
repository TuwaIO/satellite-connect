import type { LocalizedPageLoaders } from '@tuwaio/docs-ui/nextra/page';

/**
 * The translated pages of the site by route. Each translation mirrors its English page: `uk/index.mdx` translates
 * `src/content/index.mdx`, `uk/packages/index.mdx` the generated `src/content/packages/index.md` (whose text is
 * `typedoc/packages-overview.md`). Package READMEs and the API reference stay in English. `tuwa-docs-i18n-check` keeps
 * the translations in line with the English pages.
 */
export const localizedPages: Record<string, LocalizedPageLoaders> = {
  '/': {
    uk: () => import('./uk/index.mdx'),
    'zh-CN': () => import('./zh-CN/index.mdx'),
  },
  '/packages': {
    uk: () => import('./uk/packages/index.mdx'),
    'zh-CN': () => import('./zh-CN/packages/index.mdx'),
  },
};
