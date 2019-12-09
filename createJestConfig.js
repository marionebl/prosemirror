module.exports = () => {
  return {
    // default config
    preset: 'ts-jest',
    globals: {
      'ts-jest': {
        diagnostics: false,
      },
    },
    testMatch: ['**/__tests__/*.+(ts|tsx|js)'],
    moduleDirectories: ['node_modules'],
  };
};
