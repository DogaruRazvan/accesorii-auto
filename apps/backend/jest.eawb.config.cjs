module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/__tests__/*.eawb.spec.ts"],
  transform: { "^.+\\.ts$": ["@swc/jest", { jsc: { parser: { syntax: "typescript", decorators: true }, target: "es2021" } }] },
  modulePathIgnorePatterns: ["<rootDir>/.medusa/"],
}
