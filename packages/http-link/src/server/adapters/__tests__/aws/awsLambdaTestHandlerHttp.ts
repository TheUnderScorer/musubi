import {
  createAwsLambdaHttpLink,
  LambdaApiFormat,
} from '../../aws-lambda-adapter';
import { MusubiReceiver } from '@musubi/core';
import {
  setupTestUserHandlers,
  testSchema,
} from '../../../../../../../tools/test/testMusubi';
import { lambdaPaths } from './const';

const { link, getHandler } = createAwsLambdaHttpLink({
  pathPrefix: lambdaPaths[LambdaApiFormat.v2].server,
  timeoutMs: 15_000,
  format: LambdaApiFormat.v2,
});

const receiver = new MusubiReceiver(testSchema, [link]);

setupTestUserHandlers(receiver);

export const handler = getHandler();
