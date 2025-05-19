import { createDefaultPreset } from 'ts-jest';

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/archive/'],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
  resolver: 'jest-ts-webcompat-resolver',
  setupFilesAfterEnv: ['./tests/setup-tests.ts'],
  transform: {
    ...createDefaultPreset().transform,
  },
};

export default config;
