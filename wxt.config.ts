import vueJsx from '@vitejs/plugin-vue-jsx';
import { fileURLToPath, URL } from 'node:url';
import path from 'path';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Icons from 'unplugin-icons/vite';
import removeConsole from 'vite-plugin-remove-console';
import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// https://wxt.dev/api/config.html
// https://github.com/wxt-dev/wxt
export default defineConfig({
  modules: [
    '@wxt-dev/module-vue',
    '@wxt-dev/auto-icons',
    '@wxt-dev/i18n/module',
  ],
  manifestVersion: 3,
  srcDir: 'src',
  manifest: {
    default_locale: "en",
    name: 'Local bookmark manager',
    description: "Local bookmark manager",
    permissions: [
      "bookmarks",
      "history",
      "tabs",
      "favicon",
      'tabGroups',
    ],
    host_permissions: [
      "https://*/*",
      "http://*/*",
      "<all_urls>"
    ],
    web_accessible_resources: [
      {
        "resources": ["_favicon/*", "background.js"],
        "matches": ["<all_urls>"]
      }
    ],
  },
  vite: (configEnv) => ({
    plugins: [
      vueJsx(),
      ...configEnv.mode === 'production'
        ? [removeConsole({ includes: ['log', 'warn'] })]
        : [],
      Icons({
        customCollections: {
          'my-icons': FileSystemIconLoader(
            path.resolve(__dirname, 'src/assets/icons'),
          ),
        },
      }),
      tailwindcss(),
    ],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  }),
});
