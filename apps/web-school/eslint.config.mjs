import { nextJsConfig } from "@repo/eslint-config/next-js";

const baseConfig = nextJsConfig.map((c) => ({
  ...c,
  rules: {
    ...c.rules,
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
  },
}));

/** @type {import("eslint").Linter.Config[]} */
export default [
  { ignores: [".next/**"] },
  ...baseConfig,
];
