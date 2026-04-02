import type { Config } from 'jest';

const config: Config = {
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	preset: 'ts-jest/presets/default-esm',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	testEnvironment: 'node',
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				diagnostics: false,
				useESM: true,
			},
		],
	},
};

export default config;
