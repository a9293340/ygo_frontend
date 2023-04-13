import { fileURLToPath, URL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueI18n({
			include: resolve(
				dirname(fileURLToPath(import.meta.url)),
				'./path/to/src/locales/**'
			),
		}),
		AutoImport({
			include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
			imports: ['vue', 'vue-router', 'vue-i18n', 'pinia'],
			dts: 'src/auto-imports.ts',
		}),
		Components({
			extensions: ['vue'],
			include: [/\.vue$/, /\.vue\?vue/],
			dts: 'src/auto-components.ts',
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		host: '0.0.0.0',
	},
});
