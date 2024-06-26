import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import checker from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
  const isDev = mode !== 'production';

  const outDir = path.resolve(
    __dirname,
    '../../../dist/packages/examples/browser-extension'
  );

  return {
    root: __dirname,
    build: {
      reportCompressedSize: true,
      commonjsOptions: { transformMixedEsModules: true },
      outDir,
      emptyOutDir: true,
      minify: isDev ? false : 'esbuild',
      sourcemap: isDev ? true : 'hidden',
      modulePreload: false,
      rollupOptions: {
        input: {
          popup: path.resolve(__dirname, 'index.html'),
          background: path.resolve(__dirname, 'src/background/background.ts'),
          'csScripts/mainFrame': path.resolve(
            __dirname,
            'src/content-scripts/mainFrameRoot.ts'
          ),
          'csScripts/perFrame': path.resolve(
            __dirname,
            'src/content-scripts/perFrameRoot.ts'
          ),
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name].js',
          inlineDynamicImports: false,
        },
      },
    },
    plugins: [
      nxViteTsPaths(),
      react(),
      checker({
        typescript: {
          tsconfigPath: path.resolve(__dirname, 'tsconfig.app.json'),
        },
      }),
      viteStaticCopy({
        targets: [
          {
            src: path.resolve(__dirname, 'manifest.json'),
            dest: './',
          },
        ],
      }),
    ],
  };
});
