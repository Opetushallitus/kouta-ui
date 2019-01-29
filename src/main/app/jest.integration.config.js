module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['<rootDir>/integrationTests/**/*.test.js'],
  setupFilesAfterEnv: ['expect-puppeteer'],
};
