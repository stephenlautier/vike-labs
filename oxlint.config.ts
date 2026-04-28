import { defineConfig } from "oxlint";

export default defineConfig({
	plugins: ["typescript", "import", "react", "react-perf", "jsx-a11y", "vitest", "unicorn"],
	env: {
		browser: true,
		es2022: true,
		node: true,
	},
	categories: {
		correctness: "error",
		suspicious: "error",
		perf: "error",
		restriction: "warn",
		style: "warn",
		pedantic: "warn",
	},
	rules: {
		// ── General ────────────────────────────────────────────────────────────
		curly: ["error", "all", "consistent"],
		"prefer-const": "error",
		"prefer-template": "error",
		"sort-keys": "off",
		eqeqeq: "error",
		"no-var": "error",
		"no-console": ["warn", { allow: ["warn", "error"] }],
		"no-process-exit": "off",
		"no-unused-vars": "off", // handled by typescript/no-unused-vars
		"no-ternary": "off",
		"no-nested-ternary": "off",
		"no-continue": "off",
		"no-plusplus": "off",
		"no-magic-numbers": "off",
		"no-use-before-define": "off",
		"no-duplicate-imports": ["error", { allowSeparateTypeImports: true }],
		"init-declarations": "off",
		"max-statements": ["warn", { max: 40 }],
		"id-length": "off",
		"capitalized-comments": "off",
		"sort-imports": [
			"warn",
			{
				ignoreCase: true,
				ignoreDeclarationSort: true,
				ignoreMemberSort: true,
				memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
			},
		],
		"object-shorthand": "error",
		"prefer-destructuring": "off",

		// ── Import ─────────────────────────────────────────────────────────────
		"import/no-default-export": "off", // Vike requires default exports for +Page, +Layout etc.
		"import/no-relative-parent-imports": "off",
		"import/exports-last": "off",
		"import/no-nodejs-modules": "off",
		"import/extensions": [
			"error",
			{
				ts: "never",
				tsx: "never",
				js: "never",
				jsx: "never",
			},
		],
		"import/no-namespace": ["error", { ignore: ["valibot"] }], // allow: import * as v from 'valibot'
		"import/group-exports": "off",
		"import/no-named-export": "off",
		"import/no-cycle": "warn",
		"import/no-self-import": "error",

		// ── TypeScript ─────────────────────────────────────────────────────────
		"typescript/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
		"typescript/consistent-type-imports": ["error", { prefer: "type-imports" }],
		"typescript/no-explicit-any": "error",
		"typescript/explicit-function-return-type": ["warn", { allowExpressions: true }],
		"typescript/no-non-null-assertion": "warn",
		"typescript/consistent-type-definitions": ["warn", "type"],
		"typescript/no-require-imports": "error",
		"typescript/no-import-type-side-effects": "error",
		"typescript/prefer-nullish-coalescing": "warn",
		"typescript/prefer-optional-chain": "warn",
		"typescript/explicit-member-accessibility": "off",
		"typescript/no-floating-promises": "error",
		"typescript/await-thenable": "error",
		"typescript/no-misused-promises": "error",
		"typescript/restrict-template-expressions": "warn",
		"typescript/no-unnecessary-type-assertion": "error",
		"typescript/no-wrapper-object-types": "error",

		// ── React ──────────────────────────────────────────────────────────────
		"react/jsx-key": "error",
		"react/jsx-no-duplicate-props": "error",
		"react/jsx-no-undef": "error",
		"react/no-danger": "error",
		"react/no-danger-with-children": "error",
		"react/no-direct-mutation-state": "error",
		"react/no-string-refs": "error",
		"react/no-children-prop": "error",
		"react/exhaustive-deps": "warn",
		"react/jsx-fragments": ["warn", "syntax"],
		"react/jsx-boolean-value": ["warn", "never"],
		"react/jsx-curly-brace-presence": ["warn", { props: "never", children: "never" }],
		"react/jsx-no-constructed-context-values": "error",
		"react/no-array-index-key": "warn",
		"react/self-closing-comp": "warn",
		"react/iframe-missing-sandbox": "error",
		"react/no-namespace": "error",
		"react/jsx-props-no-spread-multi": "error",

		// ── React Perf ─────────────────────────────────────────────────────────
		"react-perf/jsx-no-new-array-as-prop": "warn",
		"react-perf/jsx-no-new-object-as-prop": "warn",
		"react-perf/jsx-no-new-function-as-prop": "warn",
		"react-perf/jsx-no-jsx-as-prop": "warn",

		// ── JSX A11y ───────────────────────────────────────────────────────────
		"jsx-a11y/alt-text": "error",
		"jsx-a11y/anchor-has-content": "error",
		"jsx-a11y/anchor-is-valid": "error",
		"jsx-a11y/aria-props": "error",
		"jsx-a11y/aria-role": "error",
		"jsx-a11y/click-events-have-key-events": "warn",
		"jsx-a11y/html-has-lang": "error",
		"jsx-a11y/img-redundant-alt": "warn",
		"jsx-a11y/no-autofocus": "warn",
		"jsx-a11y/no-redundant-roles": "warn",
		"jsx-a11y/iframe-has-title": "error",
		"jsx-a11y/label-has-associated-control": "error",
		"jsx-a11y/tabindex-no-positive": "warn",

		// ── Vitest ─────────────────────────────────────────────────────────────
		"vitest/no-focused-tests": "error",
		"vitest/no-disabled-tests": "warn",
		"vitest/expect-expect": "error",
		"vitest/valid-expect": "error",
		"vitest/no-standalone-expect": "error",
		"vitest/consistent-test-it": ["warn", { fn: "it" }],

		// ── Unicorn ────────────────────────────────────────────────────────────
		"unicorn/no-array-for-each": "off", // prefer for..of is too opinionated
		"unicorn/prefer-module": "off", // not relevant with bundlers
		"unicorn/no-null": "off",
		"unicorn/filename-case": "off", // Vike uses +Page.tsx etc.
		"unicorn/no-abusive-eslint-disable": "error",
		"unicorn/no-nested-ternary": "off",
		"unicorn/prefer-node-protocol": "error",
		"unicorn/throw-new-error": "error",
		"unicorn/no-useless-undefined": "warn",
		"unicorn/prefer-ternary": "off",
	},
	overrides: [
		{
			// Vike convention files — allow default exports
			files: ["**/pages/**/*.tsx", "**/pages/**/*.ts", "**/*.config.ts", "**/*.config.js"],
			rules: {
				"import/no-default-export": "off",
			},
		},
		{
			// Storybook stories — allow default exports
			files: ["**/*.stories.tsx", "**/*.stories.ts"],
			rules: {
				"import/no-default-export": "off",
			},
		},
		{
			// Test files — relax some rules
			files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
			rules: {
				"typescript/no-explicit-any": "off",
				"typescript/no-non-null-assertion": "off",
				"max-statements": "off",
			},
		},
		{
			// StencilJS components — class-based, uses h() not React, HTML attrs not React attrs
			files: ["libs/ui/src/**/*.tsx"],
			rules: {
				"react/prefer-function-component": "off",
				// Stencil uses h() imported from @stencil/core, not React.createElement
				"react/react-in-jsx-scope": "off",
				// Stencil uses .tsx extension by convention
				"react/jsx-filename-extension": "off",
				// Stencil uses HTML class= attribute, not React className=
				"react/no-unknown-property": "off",
				// @Component, @Prop etc. are TS decorators, not constructor calls
				"new-cap": "off",
				// render() is a Stencil lifecycle method
				"class-methods-use-this": "off",
				// @Prop() requires explicit types for Stencil compiler type generation
				"typescript/no-inferrable-types": "off",
				// render() return type is implicit JSX; Stencil convention omits it
				"typescript/explicit-function-return-type": "off",
				"typescript/explicit-module-boundary-types": "off",
				// Named exports are correct for libs (AGENTS.md)
				"import/prefer-default-export": "off",
			},
		},
	],
	ignorePatterns: [
		"dist/**",
		"build/**",
		".vike/**",
		"coverage/**",
		"node_modules/**",
		"*.min.js",
		"pnpm-lock.yaml",
		// Stencil autogenerated files
		"libs/ui/src/components.d.ts",
		"libs/ui/src/react/**",
	],
});
