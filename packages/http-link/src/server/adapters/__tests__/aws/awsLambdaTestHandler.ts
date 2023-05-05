import { createAwsLambdaHttpLink } from '../../aws-lambda-adapter';
import { MusubiReceiver } from '@musubi/core';
import {
  setupTestUserHandlers,
  testSchema,
} from '../../../../../../../tools/test/testMusubi';
import { pathPrefix } from './const';

const { link, getHandler } = createAwsLambdaHttpLink({
  pathPrefix: pathPrefix.server,
  timeoutMs: 15_000,
});

const receiver = new MusubiReceiver(testSchema, [link]);

setupTestUserHandlers(receiver);

export const handler = getHandler();
