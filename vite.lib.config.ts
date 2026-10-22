import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/lib',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UXIGL',
      formats: ['es', 'cjs'],
      fileName: (format) => `uxigl.${format === 'es' ? 'js' : 'cjs'}`,
      cssFileName: 'style',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'lucide-react',
        'sheetgl',
        'filemangl',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'lucide-react': 'LucideReact',
          sheetgl: 'SheetGL',
          filemangl: 'FileManGL',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: false,
  },
});
