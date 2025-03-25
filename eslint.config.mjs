import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
	{languageOptions: { globals: {...globals.es2024, ...globals.node, ...globals.jest} }},
];
