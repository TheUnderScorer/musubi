import { RollupExecutorSchema } from './schema';
import { ExecutorContext } from 'nx/src/config/misc-interfaces';
import typescript from 'rollup-plugin-typescript2';
import jsonPlugin from '@rollup/plugin-json';
import external from 'rollup-plugin-peer-deps-external';
import dtsPlugin from 'rollup-plugin-dts';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import * as path from 'path';
import copy from 'rollup-plugin-copy';
import { RollupOptions } from 'rollup';
import { PackageJson } from 'nx/src/utils/package-json';
import { NormalizedRollupExecutorOptions } from '@nx/rollup/src/executors/rollup/lib/normalize';
import jsx from 'acorn-jsx';

export function buildRollupConfig(
  options: NormalizedRollupExecutorOptions & RollupExecutorSchema,
  context: ExecutorContext,
  sourceRoot: string,
  projectRoot: string,
  outputPath: string,
  packageJson: PackageJson
): RollupOptions[] {
  const inputFiles = options.inputFiles.map((file) =>
    path.join(sourceRoot, file)
  );

  const tsconfig = path.resolve(projectRoot, 'tsconfig.lib.json');

  const commonInput = {
    plugins: [
      typescript({
        tsconfig,
      }),
      external({
        packageJsonPath: path.resolve(sourceRoot, 'package.json'),
      }),
      resolve(),
      commonjs(),
      jsonPlugin(),
    ],
  };

  const commonOutput = {};

  return [
    ...inputFiles.flatMap((file, index) => {
      const fileName = path.parse(file).name;

      const plugins = [...commonInput.plugins];

      if (index === 0) {
        plugins.push(
          copy({
            copyOnce: true,
            targets: [
              {
                src: path.join(projectRoot, 'README.md'),
                dest: outputPath,
              },
              {
                src: path.join(projectRoot, 'CHANGELOG.md'),
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
        external: Object.keys(packageJson.dependencies ?? {}),
      };

      return [
        {
          ...input,
          output: {
            ...commonOutput,
            file: `${outputPath}/${fileName}.cjs.js`,
            format: 'cjs',
          },
        },
        {
          ...input,
          output: {
            ...commonOutput,
            file: `${outputPath}/${fileName}.esm.js`,
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
            file: `${outputPath}/${fileName}.d.ts`,
            format: 'es',
          },
        },
      ].map((opt) => ({
        ...opt,
        acornInjectPlugins: [jsx()],
      })) as RollupOptions[];
    }),
  ];
}
