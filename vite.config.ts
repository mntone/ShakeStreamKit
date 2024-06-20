import { readFileSync } from 'fs'
import { env } from 'node:process'

import react from '@vitejs/plugin-react-swc'
import { config } from 'dotenv'
import sri from 'rollup-plugin-sri'
import { createHtmlPlugin as html } from 'vite-plugin-html'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

config()
config({ path: '.env.local', override: true })

export default defineConfig({
	base: '/shake-streamkit/',
	build: {
		target: ['esnext', 'chrome103', 'safari16'],
		assetsDir: 'a',
		cssMinify: 'lightningcss',
		reportCompressedSize: false,
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
		react({ devTarget: 'esnext' }),
		html({
			minify: true,
		}),
		{
			enforce: 'post',
			...sri({
				algorithms: ['sha256'],
				publicPath: '/shake-streamkit/',
			}),
		},
	],
	server: {
		https: env.SERVER_SSLCERT && env.SERVER_SSLKEY && {
			cert: readFileSync(env.SERVER_SSLCERT),
			key: readFileSync(env.SERVER_SSLKEY),
		} as any,
	},
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['src/**/*.test.[jt]s?(x)'],
		setupFiles: [
			'src/setupTests.ts',
		],
	},
})
