import type {Config} from '@jest/types';


const config: Config.InitialOptions = {
  verbose: true,
  maxConcurrency: 5,
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["build/*"]
};
export default config;