import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

const unusedVariableRule = [
  "error",
  {
    varsIgnorePattern: "^[A-Z_]",
    argsIgnorePattern: "^_",
  },
];

export default defineConfig([
  globalIgnores([
    "dist/**",
    "node_modules/**",
    "server/node_modules/**",
    "**/*.zip",
  ]),

  /*
   * React/Vite client files.
   */
  {
    files: ["src/**/*.{js,jsx}"],

    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      "no-unused-vars": unusedVariableRule,
      "react-hooks/set-state-in-effect": "off",
    },
  },

  /*
   * Express, PostgreSQL, tests, and Node-based config.
   */
  {
    files: ["server/**/*.js", "vite.config.js", "eslint.config.js"],

    extends: [js.configs.recommended],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },

    rules: {
      "no-unused-vars": unusedVariableRule,
    },
  },
]);
