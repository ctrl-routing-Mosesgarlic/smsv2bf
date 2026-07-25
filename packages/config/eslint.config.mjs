import { config } from "@repo/eslint-config/base";

const baseConfig = config.map((c) => ({
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
  ...baseConfig,
];
