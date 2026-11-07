import { createDocsPage } from '@tuwaio/docs-ui/nextra/page';

import { localizedPages } from '@/i18n/pages';

const { generateStaticParams, generateMetadata, Page } = createDocsPage({ localizedPages, locale: 'zh-CN' });

// Only the translated pages: the English reference has one URL, and an unknown page is a 404
export const dynamicParams = false;

export { generateMetadata, generateStaticParams };
export default Page;
