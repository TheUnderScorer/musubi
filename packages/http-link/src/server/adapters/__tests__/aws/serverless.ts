import cp from 'child_process';
import * as path from 'path';

let serverlessProcess: cp.ChildProcess | undefined;

export async function startServerless(port = 3001) {
  const nodeModulesPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    '..',
    '..',
    'node_modules'
  );

  const serverlessPath = path.join(nodeModulesPath, '.bin', 'serverless');

  serverlessProcess = cp.spawn(
    serverlessPath,
    [
      'offline',
      'start',
      '--stage',
      'development',
      '--httpPort',
      port.toString(),
    ],
    {
      cwd: __dirname,
    }
  );

  return new Promise<void>((resolve) => {
    const handler = (event: Buffer) => {
      const data = event.toString('utf8');

      console.log(data);

      if (data.includes('localhost')) {
        serverlessProcess?.stdout?.off('data', handler);

        resolve();
      }
    };

    serverlessProcess?.stdout?.on('data', handler);
  });
}

export function stopServerless() {
  serverlessProcess?.kill();
}
