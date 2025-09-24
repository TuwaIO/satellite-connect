module.exports = {
  branches: [
    'main',
    {
      name: 'dev/**',
      prerelease: '${name.replace(/\\//g, "-").toLowerCase()}-alpha',
    },
    {
      name: 'fix/**',
      prerelease: '${name.replace(/\\//g, "-").toLowerCase()}-alpha',
    },
    {
      name: 'feature/**',
      prerelease: '${name.replace(/\\//g, "-").toLowerCase()}-alpha',
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
          echo "NPM user:" &&
          npm whoami
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
