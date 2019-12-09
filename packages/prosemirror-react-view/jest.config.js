const createJestConfig = require('../../createJestConfig');
const packageName = require('./package.json')
  .name.split('@marduke182/')
  .pop();

module.exports = {
  ...createJestConfig(),
  name: packageName,
  displayName: packageName,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  rootDir: './',
};
