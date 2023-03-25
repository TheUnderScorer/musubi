import {
  ClientLink,
  OperationRequest,
  OperationResponse,
  OperationsSchema,
} from '@musubi/core';
import { BrowserExtensionContext } from './context';
import {
  BrowserExtensionChannel,
  browserExtensionChannelSchema,
} from './channel';
import { sendMessage } from './send';
import { observeGlobalResponses } from './globalListener';
import { filter, Observable } from 'rxjs';
import { DefaultChannels } from './defaultChannel';
import { ChannelResolver } from './ChannelResolver';

export class BrowserExtensionClientLink<S extends OperationsSchema>
  implements ClientLink<BrowserExtensionContext>
{
  private readonly channelResolver: ChannelResolver<S>;

  constructor(
    private readonly currentChannel: BrowserExtensionChannel,
    private readonly defaultChannels: DefaultChannels<S> = {
      commands: {},
      events: {},
      queries: {},
    }
  ) {
    this.channelResolver = new ChannelResolver(currentChannel, defaultChannels);
  }

  subscribeToEvent<Payload>(
    request: OperationRequest<Payload, BrowserExtensionContext>
  ) {
    return observeGlobalResponses().pipe(
      filter((response) => response.operationName === request.name)
    ) as Observable<
      OperationResponse<
        Payload,
        OperationRequest<unknown, BrowserExtensionContext>
      >
    >;
  }

  async sendRequest<Payload, Result>(
    request: OperationRequest<Payload, BrowserExtensionContext>
  ): Promise<
    OperationResponse<
      Result,
      OperationRequest<Payload, BrowserExtensionContext>
    >
  > {
    const channel = await this.channelResolver.resolve(
      request.kind,
      request.name,
      request.channel as BrowserExtensionChannel
    );

    if (!channel) {
      return OperationResponse.fromError(
        request.name,
        request.kind,
        new Error('Request has no channel, unable to send'),
        request
      );
    }

    request.addCtx({
      sentFromChannel: this.currentChannel,
    } as BrowserExtensionContext);

    return new Promise<
      OperationResponse<
        Result,
        OperationRequest<Payload, BrowserExtensionContext>
      >
    >((resolve) => {
      const subscription = observeGlobalResponses()
        .pipe(
          filter((response) => {
            console.log('waiting for response', {
              response,
              request,
            });

            return response.request?.id === request.id;
          })
        )
        .subscribe((response) => {
          subscription.unsubscribe();

          resolve(
            response as OperationResponse<
              Result,
              OperationRequest<Payload, BrowserExtensionContext>
            >
          );
        });

      sendMessage(
        request,
        browserExtensionChannelSchema.parse(channel),
        this.currentChannel
      );
    });
  }
}
