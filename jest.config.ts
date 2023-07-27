export default {
    clearMocks: true,
    collectCoverage: true,
    coveragePathIgnorePatterns: ['/node_modules/'],
    rootDir: '.',
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    preset: 'ts-jest',
    moduleNameMapper: {
        '@types': '<rootDir>/interfaces/index',
        '@lib/(.*)': '<rootDir>/lib/$1',
        '@commands/(.*)': '<rootDir>/commands/$1',
        '@actions/(.*)': '<rootDir>/actions/$1',
        '@ui/(.*)': '<rootDir>/ui/$1',
        '@/(.*)': '<rootDir>/$1',
    },
    testEnvironment: 'node',
};
