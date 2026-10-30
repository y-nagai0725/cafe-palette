import { defineConfig } from 'vite';
import stylelint from 'vite-plugin-stylelint';
import handlebars from 'vite-plugin-handlebars';
import { resolve } from 'path';

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    stylelint({
      fix: true,
      include: ['src/**/*.scss'],
    }),
    handlebars({
      partialDirectory: resolve(import.meta.dirname, 'src/svg'),
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'js/bundle.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/style.css';
          }
          return 'assets/[name].[ext]';
        }
      }
    }
  }
});