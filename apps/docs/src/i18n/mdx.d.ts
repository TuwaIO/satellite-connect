// The exports of an MDX file compiled by Nextra, for the translated pages imported in `pages.ts`
declare module '*.mdx' {
  import type { EvaluateResult } from 'nextra';

  const MDXContent: EvaluateResult['default'];
  export default MDXContent;
  export const toc: EvaluateResult['toc'];
  export const metadata: EvaluateResult['metadata'];
  export const sourceCode: EvaluateResult['sourceCode'];
}
