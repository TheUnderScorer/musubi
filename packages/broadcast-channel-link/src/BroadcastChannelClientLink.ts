import { ClientLink, OperationRequest, OperationResponse } from '@musubi/core';
import { BroadcastChannelLinkContext, CommunicationChannel } from './types';
import { Observable } from 'rxjs';

export class BroadcastChannelClientLink
  implements ClientLink<BroadcastChannelLinkContext>
{
  constructor(private readonly broadcastChannel: CommunicationChannel) {}

  sendRequest<Payload, Result>(
    request: OperationRequest<Payload, BroadcastChannelLinkContext>
  ): Promise<
    OperationResponse<
      Result,
      OperationRequest<Payload, BroadcastChannelLinkContext>
    >
  > {
    return new Promise((resolve) => {
      const listener = (message: MessageEvent) => {
        try {
          const response = OperationResponse.fromUnsafeObject<
            Result,
            OperationRequest<Payload, BroadcastChannelLinkContext>
          >(message.data);

          if (response.request?.id === request.id) {
            this.broadcastChannel.removeEventListener('message', listener);

            resolve(response);
          }
        } catch {
          // Nothing here
        }
      };

      this.broadcastChannel.addEventListener('message', listener);

      this.broadcastChannel.postMessage(request.toJSON());
    });
  }

  subscribeToEvent<Payload>(
    request: OperationRequest<unknown, BroadcastChannelLinkContext>
  ): Observable<
    OperationResponse<
      Payload,
      OperationRequest<unknown, BroadcastChannelLinkContext>
    >
  > {
    return new Observable((observer) => {
      const listener = (message: MessageEvent) => {
        try {
          const response = OperationResponse.fromUnsafeObject<
            Payload,
            OperationRequest<unknown, BroadcastChannelLinkContext>
          >(message.data);

          if (response.operationName === request.name) {
            observer.next(response);
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
}
