import { Subject, tap } from 'rxjs';
import { OperationRequest, OperationResponse } from '@musubi/core';
import * as browser from 'webextension-polyfill';
import { Runtime } from 'webextension-polyfill';
import { BrowserExtensionContext } from './context';

export function observeGlobalRequests<Ctx = unknown>() {
  const newRequest = new Subject<OperationRequest<unknown, Ctx>>();

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
  return newRequest.asObservable().pipe(
    tap({
      complete: () => {
        browser.runtime.onMessage.removeListener(listener);
      },
    })
  );
}

export function observeGlobalResponses<Ctx = unknown>() {
  const newResponse = new Subject<
    OperationResponse<unknown, OperationRequest<unknown, Ctx>>
  >();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listener = (message: any) => {
    const parsed = OperationResponse.schema.safeParse(message);

    console.log('parsed maybe response', {
      message,
      parsed,
    });

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
  return newResponse.asObservable().pipe(
    tap({
      complete: () => {
        browser.runtime.onMessage.removeListener(listener);
      },
    })
  );
}
