import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";

export default [
	{
		ignores: [
			"node_modules",
			"dist",
			"build",
			".expo",
			"coverage",
			"jest/__mocks__/**",
			// functions/ is a separate TypeScript program with its own tsconfig and
			// lint step (`npm --prefix functions run lint`). Linting it from here fails
			// with "file not found in any of the provided project(s)".
			"functions/**",
		],
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
			globals: {
				...globals.es2021,
				// React Native injects these; they are not Node or browser globals.
				__DEV__: "readonly",
				process: "readonly",
				console: "readonly",
				fetch: "readonly",
				XMLHttpRequest: "readonly",
				Blob: "readonly",
				FormData: "readonly",
				setTimeout: "readonly",
				clearTimeout: "readonly",
				setInterval: "readonly",
				clearInterval: "readonly",
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
		files: ["__tests__/**/*.ts", "__tests__/**/*.tsx"],
		languageOptions: {
			globals: {
				...globals.jest,
				...globals.node,
			},
		},
	},

	{
		// Keep every Firebase call behind src/services/firebase. That seam is what
		// makes the planned move to a Node.js backend (or to @react-native-firebase)
		// a change to one directory instead of a change to every screen.
		files: ["src/**/*.ts", "src/**/*.tsx", "App.tsx"],
		ignores: ["src/services/firebase/**"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							// Anchored: `group` globs match any path segment, so a bare
							// "firebase" pattern also flags "../../services/firebase".
							regex: "^(firebase|@firebase)(/|$)",
							message:
								"Import from src/services/firebase instead. Screens and components must not talk to the Firebase SDK directly.",
						},
					],
				},
			],
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
				...globals.browser,
				...globals.node,
				...globals.jest,
				__DEV__: "readonly",
			},
		},
		rules: {
			"@typescript-eslint/no-var-requires": "off",
			"@typescript-eslint/no-require-imports": "off",
			"@typescript-eslint/no-unused-vars": "off",
		},
	},
];
