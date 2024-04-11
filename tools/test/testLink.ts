import { ClientLink } from '../../packages/core/src/client/client.types';
import { ReceiverLink } from '../../packages/core/src/receiver/receiver.types';
import { OperationRequest } from '../../packages/core/src/shared/OperationRequest';
import { OperationResponse } from '../../packages/core/src/shared/OperationResponse';
import {
  OperationKind,
  OperationName,
} from '../../packages/core/src/schema/schema.types';
import { Observable } from '../../packages/core/src/observable/Observable';

export function createTestLink() {
  const clientLink = {
    subscribeToEvent: jest.fn(),
    sendRequest: jest.fn(),
  } satisfies ClientLink;

  const receiverLink = {
    receiveRequest: jest.fn(),
    sendResponse: jest.fn(),
  } satisfies ReceiverLink;

  const newRequest = new Observable<OperationRequest>();
  const newResponse = new Observable<OperationResponse>();
  const newEvent = new Observable<OperationResponse>();

  receiverLink.receiveRequest.mockImplementation((name: OperationName) => {
    return newRequest.filter((req) => req.name === name);
  });

  receiverLink.sendResponse.mockImplementation(
    async (response: OperationResponse) => {
      if (response.operationKind === OperationKind.Event) {
        await newEvent.next(response);
      } else {
        await newResponse.next(response);
      }
    }
  );

  clientLink.subscribeToEvent.mockImplementation(
    (request: OperationRequest) => {
      return newEvent.filter((res) => res.operationName === request.name);
    }
  );

  clientLink.sendRequest.mockImplementation((request) => {
    return new Promise((resolve) => {
      const sub = newResponse
        .filter((res) => res.request?.id === request.id)
        .subscribe((response) => {
          sub.unsubscribe();

          resolve(response);
        });

      newRequest.next(request);
    });
  });

  return {
    clientLink,
    receiverLink,
  };
}
