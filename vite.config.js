import { defineConfig } from 'vite';
import stylelint from 'vite-plugin-stylelint';

export default defineConfig({
  plugins: [
    stylelint({
      fix: true,
      include: ['src/**/*.scss'],
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