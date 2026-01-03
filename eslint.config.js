import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
	// Ignore build/output folders
	{
		ignores: ["node_modules", "dist", "build", ".expo", "coverage", "jest/__mocks__/**"],
	},

	// Base JS rules
	js.configs.recommended,

	// TypeScript rules for your app code
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: "./tsconfig.json",
				ecmaVersion: 2018,
				sourceType: "module",
			},
		},
		plugins: {
			"@typescript-eslint": tsPlugin,
		},
		rules: {
			"@typescript-eslint/no-floating-promises": ["error", {}],
			"@typescript-eslint/no-var-requires": "off", // allow require() in TS files if needed
		},
	},

	// Node config / Jest files (babel.config.js, metro.config.js, app.config.js, mocks)
	{
		files: [
			"*.js",
			"*.cjs",
			"*.mjs",
			"babel.config.js",
			"metro.config.js",
			"app.config.js",
			"app.config.ts",
			"jest/**/*.js",
			"jest/**/*.cjs",
			"jest/**/*.mjs",
			"jest/**/*.ts",
			"jest/**/*.tsx",
		],
		languageOptions: {
			parser: js.parser,
			globals: {
				require: "readonly",
				module: "readonly",
				__dirname: "readonly",
			},
		},
		rules: {
			"@typescript-eslint/no-var-requires": "off",
			"@typescript-eslint/no-require-imports": "off",
			"no-undef": "off",
			"@typescript-eslint/no-unused-vars": "off",
		},
	},
	{
		files: ["src/**/*.ts", "src/**/*.tsx"], // all TS/TSX files in src
		rules: {
			"@typescript-eslint/no-var-requires": "off",
			"@typescript-eslint/no-require-imports": "off",
			"no-undef": "off",
			"@typescript-eslint/no-unused-vars": "off",
		},
	},
];
