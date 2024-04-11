import {
  Observable,
  OperationName,
  OperationRequest,
  OperationResponse,
  ReceiverLink,
} from '@musubi/core';
import { BroadcastChannelLinkContext, CommunicationChannel } from './types';

export class BroadcastChannelReceiverLink
  implements ReceiverLink<BroadcastChannelLinkContext>
{
  constructor(private readonly broadcastChannel: CommunicationChannel) {}

  receiveRequest(
    name: OperationName
  ): Observable<OperationRequest<unknown, BroadcastChannelLinkContext>> {
    return new Observable((observer) => {
      const listener = (message: MessageEvent) => {
        try {
          const request = OperationRequest.fromUnsafeObject(message.data);

          if (request.name === name) {
            observer.next(
              request.addCtx<BroadcastChannelLinkContext>({
                message: {
                  isSerializable: false,
                  value: message,
                },
              })
            );
          }
        } catch {
          // Nothing here
        }
      };

      this.broadcastChannel.addEventListener('message', listener);

      return () => {
        this.broadcastChannel.removeEventListener('message', listener);
      };
    });
  }

  async sendResponse<Payload, Result>(
    response: OperationResponse<
      Result,
      OperationRequest<Payload, BroadcastChannelLinkContext>,
      unknown
    >
  ): Promise<void> {
    this.broadcastChannel.postMessage(response.toJSON());
  }
}
