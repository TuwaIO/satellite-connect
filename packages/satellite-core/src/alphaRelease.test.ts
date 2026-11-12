import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const config = createRequire(import.meta.url)(path.join(repoRoot, 'alpha.release.config.js')) as {
  branches: (string | { name: string; prerelease: string })[];
};

/** The templates of the prerelease of the alpha branches, as semantic-release takes them. */
const templates = config.branches.flatMap((branch) => (typeof branch === 'string' ? [] : [branch.prerelease]));

/** The prerelease identifier semantic-release makes from a template for a branch: it fills `${...}` with `name`. */
const prereleaseOf = (template: string, name: string) => runInNewContext(`\`${template}\``, { name }) as string;

// semantic-release finds the last alpha of a branch among the tags whose prerelease has the identifier of the branch
// as ONE of its parts, and the parts are split at dots. A branch named `feat/nova-0.15` gave the tag
// `v1.0.0-feat-nova-0.15-alpha.1`, whose parts are `feat-nova-0`, `15-alpha` and `1`: the tag of the first push was
// never found again, and every later push failed on `git tag ... alpha.1` (the tag already exists)
describe('the alpha release of a branch', () => {
  const names = [
    'feat/nova-0.15',
    'fix/nova-transactions-0.15.1',
    'feat/Paper_Ink',
    'dev/a/b.c+d@e',
    'fix/toast-regions-labels',
  ];

  it('has a template for the dev, fix and feat branches', () => {
    expect(config.branches.flatMap((branch) => (typeof branch === 'string' ? [] : [branch.name]))).toEqual([
      'dev/**',
      'fix/**',
      'feat/**',
    ]);
    expect(templates).toHaveLength(3);
  });

  it('makes one prerelease identifier of any branch name', () => {
    for (const template of templates)
      for (const name of names) {
        const prerelease = prereleaseOf(template, name);
        // The characters of a semver identifier, and no dot: a dot would split it
        expect(prerelease, name).toMatch(/^[0-9a-z-]+-alpha$/);
        // What semantic-release does to find the last alpha: the parts of the prerelease of its tag hold the identifier
        expect(`${prerelease}.1`.split('.'), name).toEqual([prerelease, '1']);
      }
  });

  it('keeps the names that had no such character as they were', () => {
    for (const template of templates) {
      expect(prereleaseOf(template, 'fix/toast-regions-labels')).toBe('fix-toast-regions-labels-alpha');
      expect(prereleaseOf(template, 'feat/nova-0.15')).toBe('feat-nova-0-15-alpha');
      expect(prereleaseOf(template, 'fix/nova-transactions-0.15.1')).toBe('fix-nova-transactions-0-15-1-alpha');
    }
  });
});
