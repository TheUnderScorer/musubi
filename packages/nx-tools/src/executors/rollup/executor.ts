import { rollup, RollupBuild, RollupOptions } from 'rollup';
import { ExecutorContext } from 'nx/src/config/misc-interfaces';
import invariant from 'tiny-invariant';
import { calculateProjectDependencies } from '@nrwl/js/src/utils/buildable-libs-utils';
import * as path from 'path';
import * as fs from 'fs';
import { normalizeRollupExecutorOptions } from '@nrwl/rollup/src/executors/rollup/lib/normalize';
import { RollupExecutorOptions } from '@nrwl/rollup/src/executors/rollup/schema';
import { updatePackageJson } from './packageJson';
import { makeExternal } from './external';

async function resolveConfig(
  options: RollupExecutorOptions,
  context: ExecutorContext
): Promise<RollupOptions[]> {
  const rollupConfig = Array.isArray(options.rollupConfig)
    ? options.rollupConfig[0]
    : options.rollupConfig;
  let config = await import(rollupConfig as string).then((mod) => mod.default);

  if (typeof config === 'function') {
    config = config({
      projectGraph: context.projectGraph,
      outputPath: options.outputPath,
    });
  }

  return Array.isArray(config) ? config : [config];
}

export default async function runExecutor(
  options: RollupExecutorOptions,
  context: ExecutorContext
) {
  const projectGraph = context.projectGraph?.nodes?.[context.projectName ?? ''];
  invariant(projectGraph, 'Project graph is required');

  const normalizedOptions = normalizeRollupExecutorOptions(
    options,
    context.root,
    projectGraph.data.sourceRoot ?? ''
  );

  const configArray = await resolveConfig(normalizedOptions, context);

  let error: Error | undefined;

  const bundles: RollupBuild[] = [];

  const packageJsonPath = path.join(projectGraph.data.root, 'package.json');
  const packageJson = fs.existsSync(packageJsonPath)
    ? await import(packageJsonPath).then((mod) => mod.default)
    : {};
  const rootPackageJson = await import('../../../../../package.json');

  invariant(context.projectGraph, 'Project graph is required');
  invariant(context.projectName, 'Project name is required');
  invariant(context.targetName, 'Target name is required');

  const { dependencies } = calculateProjectDependencies(
    context.projectGraph,
    context.root,
    context.projectName,
    context.targetName,
    context.configurationName ?? ''
  );

  const projectGraphDependencies =
    context.projectGraph.dependencies[context.projectName] ?? [];
  const npmDeps = projectGraphDependencies
    .filter((d) => d.target.startsWith('npm:'))
    .map((d) => d.target.slice(4));

  try {
    for (const configItem of configArray) {
      const updatedConfig = {
        ...configItem,
        external: makeExternal(
          context,
          configItem,
          packageJson,
          dependencies,
          npmDeps
        ),
      };
      const bundle = await rollup(updatedConfig);

      bundles.push(bundle);

      const output = Array.isArray(configItem.output)
        ? configItem.output
        : [configItem.output];

      for (const outputItem of output) {
        if (outputItem) {
          await bundle.write(outputItem);
        }
      }
    }

    await updatePackageJson(
      options.outputPath,
      configArray,
      packageJson,
      rootPackageJson,
      context,
      dependencies
    );
  } catch (err) {
    error = err as Error;
  } finally {
    await Promise.all(
      bundles.map((bundle) => {
        return bundle.close();
      })
    );
  }

  if (error) {
    throw error;
  }

  return {
    success: true,
  };
}
