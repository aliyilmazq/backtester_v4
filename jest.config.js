module.exports = {
  testEnvironment: "node",
  testMatch: [
    "**/tests/**/*.test.js",
    "**/__tests__/**/*.js"
  ],
  collectCoverageFrom: [
    "server/**/*.js",
    "src/services/**/*.js",
    "\!**/node_modules/**",
    "\!**/tests/**"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testTimeout: 30000,
  setupFilesAfterEnv: ["./tests/setup.js"]
};
