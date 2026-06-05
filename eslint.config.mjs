import js from "@eslint/js";
import tseslint from "typescript-eslint";

const SOURCE = [
  "app/**/*.{ts,tsx}",
  "components/**/*.{ts,tsx}",
  "lib/**/*.{ts,tsx}",
];

export default tseslint.config(
  { files: SOURCE, ...js.configs.recommended },
  ...tseslint.configs.recommended.map((c) => ({ ...c, files: SOURCE })),
  {
    files: SOURCE,
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "off",
      "no-unused-vars": "off",
    },
  }
);
