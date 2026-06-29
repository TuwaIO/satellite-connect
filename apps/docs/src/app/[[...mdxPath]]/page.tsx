import { notFound } from 'next/navigation';
import { generateStaticParamsFor, importPage } from 'nextra/pages';

import { useMDXComponents as getMDXComponents } from '../../mdx-components';

export const generateStaticParams = generateStaticParamsFor('mdxPath');

function isAssetOrInternal(mdxPath?: string[]): boolean {
  if (!mdxPath || mdxPath.length === 0) return false;
  if (mdxPath[0] === '_next') return true;
  const lastSegment = mdxPath[mdxPath.length - 1];
  if (lastSegment && lastSegment.includes('.')) return true;
  return false;
}

export async function generateMetadata(props: any) {
  const params = await props.params;
  const mdxPath = params.mdxPath;

  if (isAssetOrInternal(mdxPath)) {
    return {};
  }

  try {
    const { metadata } = await importPage(mdxPath);
    return metadata;
  } catch {
    return {};
  }
}

const Wrapper = getMDXComponents().wrapper;

export default async function Page(props: any) {
  const params = await props.params;
  const mdxPath = params.mdxPath;

  if (isAssetOrInternal(mdxPath)) {
    notFound();
  }

  let result;
  try {
    result = await importPage(mdxPath);
  } catch {
    notFound();
  }

  const { default: MDXContent, toc, metadata, sourceCode } = result;
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}
