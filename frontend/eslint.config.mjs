import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        EasyMDE: "readonly", // Declare easymde as a global variable
      },
    },
    rules: {
      "no-unused-vars": "error", // Disallow unused variables
      "no-undef": "error", // Disallow undefined variables
      semi: ["error", "always"], // Enforce semicolons
      eqeqeq: "error", // Enforce strict equality (===)
      "no-console": "warn", // Warn about console.log usage (optional)
    },
  },
  pluginJs.configs.recommended,
];
