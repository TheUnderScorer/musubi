import {
  Observable,
  OperationKind,
  OperationName,
  OperationRequest,
  OperationResponse,
  ReceiverLink,
} from '@musubi/core';
import { BrowserExtensionContext } from './context';
import {
  BrowserExtensionChannel,
  browserExtensionChannelSchema,
} from './channel';
import { observeGlobalRequests } from './globalListener';
import { sendMessage, sendMessageEverywhere } from './send';

export class BrowserExtensionReceiverLink
  implements ReceiverLink<BrowserExtensionContext>
{
  private newRequest: Observable<
    OperationRequest<unknown, BrowserExtensionContext>
  >;

  constructor(private readonly currentChannel: BrowserExtensionChannel) {
    this.newRequest = observeGlobalRequests<BrowserExtensionContext>();
  }

  private static parseResponseChannel(channel: unknown, senderTabId?: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let _channel: any = channel;

    if (
      typeof _channel === 'object' &&
      (_channel as BrowserExtensionChannel).type === 'popup' &&
      senderTabId
    ) {
      _channel = {
        type: 'tab',
        tabId: senderTabId,
      } as BrowserExtensionChannel;
    }

    return browserExtensionChannelSchema.parse(_channel);
  }

  async sendResponse<Payload, Result>(
    response: OperationResponse<
      Result,
      OperationRequest<Payload, BrowserExtensionContext>
    >
  ) {
    if (response.operationKind === OperationKind.Event) {
      if (response.channel) {
        await sendMessage(
          response,
          browserExtensionChannelSchema.parse(response.channel),
          this.currentChannel
        );
      } else {
        await sendMessageEverywhere(response);
      }

      return;
    }

    const ctx = response.request?.ctx;
    if (ctx?.sentFromChannel) {
      await sendMessage(
        response,
        BrowserExtensionReceiverLink.parseResponseChannel(
          ctx.sentFromChannel,
          ctx.senderTabId
        ),
        this.currentChannel
      );
    } else {
      console.warn('Response has no channel, unable to send', response);
    }
  }

  receiveRequest(
    name: OperationName
  ): Observable<OperationRequest<unknown, BrowserExtensionContext>> {
    return this.newRequest.filter((request) => {
      const channel = browserExtensionChannelSchema.safeParse(request.channel);

      return (
        request.name === name &&
        (!request.channel ||
          (channel.success && channel.data.type === this.currentChannel.type))
      );
    });
  }
}
