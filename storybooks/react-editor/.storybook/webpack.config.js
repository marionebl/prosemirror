module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('ts-loader'),
    options: {
      projectReferences: true
    }
  });

  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
