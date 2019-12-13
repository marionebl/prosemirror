module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('ts-loader'),
    options: {
      projectReferences: true
    }
  });

  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.mainFields =['main:ts', 'browser', 'module', 'main'];

  return config;
};
