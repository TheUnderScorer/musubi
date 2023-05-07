import { LambdaApiFormat } from '../../aws-lambda-adapter';

export const pathPrefix = {
  client: '/api',
  server: '/api',
};

export const lambdaPaths = {
  [LambdaApiFormat.v1]: {
    client: '/development/rest',
    server: '/rest',
  },
  [LambdaApiFormat.v2]: {
    client: '/http',
    server: '/http',
  },
};
