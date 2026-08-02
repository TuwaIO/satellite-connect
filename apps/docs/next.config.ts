import nextra from 'nextra';

// Set up Nextra with its configuration
const withNextra = nextra({
  defaultShowCopyCode: true,
});

// Export the final Next.js config with Nextra included
export default withNextra({
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
});
