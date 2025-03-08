/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  verbose: true,
  testEnvironment: "jsdom",
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx']
};
