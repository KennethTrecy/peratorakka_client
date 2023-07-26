const { resolve } = require("path");

module.exports = {
	"parserOptions": {
		"ecmaVersion": 2015,
		"sourceType": "module",
		"project": [
			"tsconfig.json"
		],
		"tsconfigRootDir": __dirname,
		"extraFileExtensions": [ ".svelte" ],
	},
	"include": [ "src/**/*.svelte" ],
	"ignorePatterns": [ ".eslintrc.cjs", "*.config.js" ],
	"env": {
		"browser": true,
		"es6": true,
		"node": true
	},
	"plugins": [
		"@typescript-eslint"
	],
	"parser": "@typescript-eslint/parser",
	"overrides": [
		{
			"files": [
				"*.svelte"
			],
			"parser": "svelte-eslint-parser",
			"parserOptions": {
				"parser": "@typescript-eslint/parser",
			}
		}
	],
	"extends": [
		"eslint:all",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:svelte/recommended",
		"whitelistyle"
	]
}
