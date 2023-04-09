import typescript from 'rollup-plugin-typescript2';
import jsonPlugin from '@rollup/plugin-json';
import external from 'rollup-plugin-peer-deps-external';
import dtsPlugin from 'rollup-plugin-dts';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import path from 'path';
import pkg from './package.json' assert { type: 'json' };
import url from 'url';
import copy from 'rollup-plugin-copy';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));

// TODO Copy changelog and readme
export default ({ outputPath }) => {
  const inputFiles = [
    path.join(dirname, 'src/main/main.ts'),
    path.join(dirname, 'src/renderer/renderer.ts'),
  ];

  const tsconfig = path.resolve(dirname, 'tsconfig.lib.json');

  const commonInput = {
    plugins: [
      typescript({
        tsconfig,
      }),
      external({
        packageJsonPath: path.resolve(dirname, 'package.json'),
      }),
      resolve(),
      commonjs(),
      jsonPlugin(),
    ],
  };

  const commonOutput = {
    exports: 'named',
    sourcemap: true,
  };

  return [
    ...inputFiles.flatMap((file, index) => {
      const fileName = path.parse(file).name;

      const plugins = [...commonInput.plugins];

      if (index === 0) {
        plugins.push(
          copy({
            overwrite: true,
            targets: [
              {
                src: path.join(__dirname, 'README.md'),
                dest: outputPath,
              },
              {
                src: path.join(__dirname, 'CHANGELOG.md'),
                dest: outputPath,
              },
            ],
          })
        );
      }

      const input = {
        ...commonInput,
        plugins,
        input: file,
        external: Object.keys(pkg.dependencies ?? {}),
      };

      return [
        {
          ...input,
          output: {
            ...commonOutput,
            file: `${outputPath}/dist/${fileName}.cjs.js`,
            format: 'cjs',
          },
        },
        {
          ...input,
          output: {
            ...commonOutput,
            file: `${outputPath}/dist/${fileName}.esm.js`,
            format: 'esm',
          },
        },
        {
          ...commonInput,
          input: file,
          plugins: [
            dtsPlugin({
              tsconfig,
            }),
          ],
          output: {
            ...commonOutput,
            file: `${outputPath}/dist/${fileName}.d.ts`,
            format: 'es',
          },
        },
      ];
    }),
  ];
};
