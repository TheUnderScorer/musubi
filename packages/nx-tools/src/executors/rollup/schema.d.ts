import { RollupExecutorOptions } from '@nrwl/rollup/src/executors/rollup/schema';

export interface RollupExecutorSchema extends RollupExecutorOptions {
  additionalPeerDeps?: string[];
}
