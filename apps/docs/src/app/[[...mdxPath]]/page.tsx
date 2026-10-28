import { createDocsPage } from '@tuwaio/docs-ui/nextra/page';

import { localizedPages } from '@/i18n/pages';

const { generateStaticParams, generateMetadata, Page } = createDocsPage({ localizedPages });

export { generateMetadata, generateStaticParams };
export default Page;
