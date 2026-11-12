// The prerelease of an alpha branch: its name as ONE identifier of the version. Every character such an identifier
// cannot hold becomes a dash: the slash, and above all the dot, which splits a prerelease into parts. semantic-release
// finds the last alpha of a branch among the tags whose prerelease has this identifier as one of its parts, so with a
// dot left in (`feat/nova-0.15`) the tag of the first push is never found again, and every later push fails on
// tagging `alpha.1` a second time
const prerelease = '${name.replace(/[^0-9A-Za-z-]/g, "-").toLowerCase()}-alpha';

module.exports = {
  branches: [
    'main',
    {
      name: 'dev/**',
      prerelease,
    },
    {
      name: 'fix/**',
      prerelease,
    },
    {
      name: 'feat/**',
      prerelease,
    },
  ],
  tagFormat: 'v${version}',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/exec',
      {
        verifyConditionsCmd: `
          echo "--- Verifying NPM authentication ---" &&
          echo "NPM registry:" &&
          npm config get registry &&
          (npm whoami || echo "npm whoami not supported for this auth token, proceeding to publish step")
        `,
        prepareCmd: `
          echo "Final version will be: \${nextRelease.version}.\$(git rev-parse --short HEAD)"
          pnpm -r exec pnpm dlx json -I -f package.json -e "this.version = '\${nextRelease.version}.\$(git rev-parse --short HEAD)'"
        `,
        publishCmd: 'pnpm publish --filter "@tuwaio/*" --no-git-checks --tag alpha --access public',
      },
    ],
  ],
};
