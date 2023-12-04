import type {Config} from '@jest/types';


const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["build/*"],
  setupFiles: ["<rootDir>/.jest/setEnvVars.ts"]
};
export default config;