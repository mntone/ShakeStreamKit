import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import stylisticJsx from '@stylistic/eslint-plugin-jsx'
import esImport from 'eslint-plugin-import'
import react from 'eslint-plugin-react'
import vitest from 'eslint-plugin-vitest'
import globals from 'globals'
import ts from 'typescript-eslint'

const jsFiles = ['**/*.[jt]s?(x)']
const tsFiles = ['**/*.ts?(x)']
const jsxFiles = ['**/*.[jt]sx']
const testFiles = ['**/*.test.[jt]s?(x)']

export default ts.config(
	{
		ignores: ['./dist/*'],
		languageOptions: {
			ecmaVersion: 2022,
			globals: {
				...globals.browser,
				MediaStreamConstraints: 'readonly',
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			sourceType: 'module',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	js.configs.recommended,
	{
		files: jsFiles,
		rules: {
			'array-callback-return': ['error'],
			'camelcase': 'error',
			'no-else-return': ['error', { allowElseIf: false }],
			'no-promise-executor-return': 'error',
			'no-useless-return': 'error',
			'no-var': 'error',
			'object-shorthand': ['error', 'always', { avoidQuotes: true }],
			'prefer-const': 'error',
		},
	},
	{
		files: testFiles,
		languageOptions: {
			globals: {
				...vitest.environments.env.globals,
			},
		},
		plugins: {
			vitest,
		},
		rules: {
			...vitest.configs.recommended.rules,
		},
		settings: {
			vitest: {
				typecheck: true,
			},
		},
	},
	{
		files: jsFiles,
		plugins: {
			import: esImport,
		},
		rules: {
			'import/order': ['error', {
				'groups': [
					'builtin',
					'external',
					'internal',
					'unknown',
					'parent',
					'sibling',
					'index',
					'object',
					'type',
				],
				'pathGroups': [
					{
						pattern: '{react,react-*}',
						group: 'external',
						position: 'before',
					},
					{
						pattern: '{@heroicons/react/**,@radix-ui/**}',
						group: 'external',
						position: 'after',
					},
					{
						pattern: '{@/**,modules/**}',
						group: 'internal',
						position: 'before',
					},
					{
						pattern: 'app/**',
						group: 'parent',
						position: 'before',
					},
				],
				'pathGroupsExcludedImportTypes': ['builtin'],
				'alphabetize': {
					order: 'asc',
				},
				'newlines-between': 'always',
			}],
		},
	},
	{
		files: tsFiles,
		languageOptions: {
			parser: ts.parser,
		},
		plugins: {
			'@typescript-eslint': ts,
		},
		rules: {
			'no-unused-vars': 'off',
			...ts.configs.recommendedTypeChecked.rules,
		},
	},
	{
		files: jsxFiles,
		plugins: {
			react,
		},
		rules: {
			...react.configs.recommended.rules,
			...react.configs['jsx-runtime'].rules,
			'react/button-has-type': ['error', { button: true }],
			'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
			'react/void-dom-elements-no-children': 'error',
		},
	},

	{
		files: jsFiles,
		...stylistic.configs.customize({
			flat: true,
			indent: 'tab',
			braceStyle: '1tbs',
			commaDangle: 'always-multiline',
		}),
	},
	{
		files: jsFiles,
		plugins: {
			'@stylistic': stylistic,
		},
		rules: {
			'@stylistic/arrow-parens': ['error', 'as-needed'],
			'@stylistic/function-call-spacing': ['error', 'never'],
			'@stylistic/indent': ['error', 'tab', { SwitchCase: 0 }],
			'@stylistic/no-floating-decimal': 'off',
			'@stylistic/no-multi-spaces': ['error', { ignoreEOLComments: true }],
		},
	},
	{
		files: jsxFiles,
		plugins: {
			'@stylistic/jsx': stylisticJsx,
		},
		rules: {
			'@stylistic/jsx-curly-newline': ['error', {
				multiline: 'consistent',
				singleline: 'forbid',
			}],
			'@stylistic/jsx-closing-bracket-location': 'off',
			'@stylistic/jsx-quotes': ['error', 'prefer-single'],
		},
	},
)
