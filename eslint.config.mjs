// eslint.config.mjs

import js from "@eslint/js";
import react from "eslint-plugin-react";
import jest from "eslint-plugin-jest";

export default [
  js.configs.recommended,
  react.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      react,
      jest,  // ✅ Add Jest support
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
    env: {
      browser: true,
      es2021: true,
      jest: true,  // ✅ Enable Jest globally
    },
  },
];
