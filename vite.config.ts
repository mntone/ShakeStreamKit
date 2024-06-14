import react from '@vitejs/plugin-react-swc'
import sri from 'rollup-plugin-sri'
import { createHtmlPlugin as html } from 'vite-plugin-html'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	build: {
		target: ['es2022', 'chrome103', 'safari16'],
		assetsDir: 'a',
		cssMinify: 'lightningcss',
		rollupOptions: {
			output: {
				generatedCode: {
					constBindings: true,
					objectShorthand: true,
				},
			},
		},
	},
	plugins: [
		tsconfigPaths(),
		react({ devTarget: 'es2022' }),
		html({
			minify: true,
		}),
		{
			enforce: 'post',
			...sri({
				algorithms: ['sha256'],
				publicPath: '/',
			}),
		},
	],
	test: {
		globals: true,
		include: ['src/**/*.test.[jt]s?(x)'],
		setupFiles: [
			'src/setupTests.ts',
		],
	},
})
