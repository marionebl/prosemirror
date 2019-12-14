const path = require('path');
const { lstatSync, readdirSync } = require('fs');

const prosemirrorBasePath = path.resolve(__dirname, '..', '..', '..', 'libs', 'prosemirror');
function getPackagesNames(dir) {
  return readdirSync(dir).filter((name) =>
    lstatSync(path.join(dir, name)).isDirectory(),
  );
}


module.exports = async ({ config, mode }) => {
  // config.module.rules = config.module.rules.filter(
  //   rule =>
  //     !(
  //       rule.use &&
  //       rule.use.length &&
  //       rule.use.find(({ loader }) => loader === 'babel-loader')
  //     ),
  // );

  // config.devtool = 'source-map';
  //
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('ts-loader'),
    options: {
      projectReferences: true
    }
  });

  // config.module.rules.push({
  //   test: /\.scss$/,
  //   loaders: ['style-loader', 'css-loader', 'sass-loader'],
  //   include: path.resolve(__dirname, '../'),
  // });

  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
