module.exports = {
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: [
    '<rootDir>/src/test/setup.js',
  ],

  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.cjs',
  },
};