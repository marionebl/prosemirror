const isCI = Boolean(process.env.CI);

const reporters = ['default'];
if (isCI) {
  reporters.push('jest-junit');
}

module.exports = {
  projects: ['<rootDir>/packages/*'],
  reporters,
};
