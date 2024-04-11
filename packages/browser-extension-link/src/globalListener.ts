import { Observable, OperationRequest, OperationResponse } from '@musubi/core';
import * as browser from 'webextension-polyfill';
import { Runtime } from 'webextension-polyfill';
import { BrowserExtensionContext } from './context';

export function observeGlobalRequests<Ctx = unknown>() {
  const newRequest = new Observable<OperationRequest<unknown, Ctx>>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listener = (message: any, sender: Runtime.MessageSender) => {
    const parsed = OperationRequest.schema.safeParse(message);

    if (parsed.success) {
      const request = OperationRequest.fromObject<unknown, Ctx>(parsed.data);

      request.addCtx<BrowserExtensionContext>({
        senderTabId: {
          value: sender.tab?.id,
          isSerializable: true,
        },
      });

      newRequest.next(request);
    }
  };

  browser.runtime.onMessage.addListener(listener);

  // TODO Test if disposes correctly
  newRequest.subscribe({
    complete: () => {
      browser.runtime.onMessage.removeListener(listener);
    },
  });

  return newRequest;
}

export function observeGlobalResponses<Ctx = unknown>() {
  const newResponse = new Observable<
    OperationResponse<unknown, OperationRequest<unknown, Ctx>>
  >();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listener = (message: any) => {
    const parsed = OperationResponse.schema.safeParse(message);

    if (parsed.success) {
      newResponse.next(
        OperationResponse.fromObject<unknown, OperationRequest<unknown, Ctx>>(
          parsed.data
        )
      );
    }
  };

  browser.runtime.onMessage.addListener(listener);

  // TODO Test if disposes correctly
  newResponse.subscribe({
    complete: () => {
      browser.runtime.onMessage.removeListener(listener);
    },
  });

  return newResponse;
}
