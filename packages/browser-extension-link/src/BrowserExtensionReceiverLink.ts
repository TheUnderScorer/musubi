import {
  OperationKind,
  OperationName,
  OperationRequest,
  OperationResponse,
  ReceiverLink,
} from '@musubi/core';
import { BrowserExtensionContext } from './context';
import { filter, Observable } from 'rxjs';
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

  async sendResponse<Payload, Result>(
    response: OperationResponse<
      Result,
      OperationRequest<Payload, BrowserExtensionContext>
    >
  ) {
    console.log('sendResponse', response);

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

    if (response.request?.ctx?.sentFromChannel) {
      await sendMessage(
        response,
        browserExtensionChannelSchema.parse(
          response.request.ctx.sentFromChannel
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
    return this.newRequest.pipe(
      filter((request) => {
        const channel = browserExtensionChannelSchema.safeParse(
          request.channel
        );

        console.log('receive request', {
          channel,
          currentChannel: this.currentChannel,
          request,
          name,
        });

        return (
          request.name === name &&
          (!request.channel ||
            (channel.success && channel.data.type === this.currentChannel.type))
        );
      })
    );
  }
}
