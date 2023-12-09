import { fileURLToPath, URL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import ElementPlus from 'unplugin-element-plus/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './path/to/src/locales/**'),
    }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: ['vue', 'vue-router', 'vue-i18n', 'pinia'],
      dts: 'src/auto-imports.ts',
      resolvers: [ElementPlusResolver({ importStyle: 'sass' }), IconsResolver()],
    }),
    Components({
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: 'src/auto-components.ts',
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
        IconsResolver(),
      ],
    }),
    ElementPlus({}),
    Icons({ autoInstall: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  base: './',
  server: {
    port: 8080,
    host: '0.0.0.0',
    hmr: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://172.233.65.87:3300',
        changeOrigin: true,
        rewrite: path => path,
      },
    },
  },
});
