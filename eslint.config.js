import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
	{
		ignores: ["node_modules", "dist", "build", ".expo", "coverage", "jest/__mocks__/**"],
	},

	js.configs.recommended,

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
			// IMPORTANT: turn off base rule in TS files (prevents duplicates / wrong behavior)
			"no-unused-vars": "off",

			// Enable TS version + ignore enum members
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],

			"@typescript-eslint/no-floating-promises": ["error", {}],
			"@typescript-eslint/no-var-requires": "off",
		},
	},

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
];
