import { ClientLink } from '../client/client.types';
import { ReceiverLink } from '../receiver/receiver.types';
import { filter, Subject } from 'rxjs';
import { OperationRequest } from '../shared/OperationRequest';
import { OperationResponse } from '../shared/OperationResponse';
import { OperationKind, OperationName } from '../schema/schema.types';

export function createTestLink() {
  const clientLink = {
    subscribeToEvent: jest.fn(),
    sendRequest: jest.fn(),
  } satisfies ClientLink;

  const receiverLink = {
    receiveRequest: jest.fn(),
    sendResponse: jest.fn(),
  } satisfies ReceiverLink;

  const newRequest = new Subject<OperationRequest>();
  const newResponse = new Subject<OperationResponse>();
  const newEvent = new Subject<OperationResponse>();

  receiverLink.receiveRequest.mockImplementation((name: OperationName) => {
    return newRequest.pipe(filter((req) => req.name === name));
  });

  receiverLink.sendResponse.mockImplementation(
    (response: OperationResponse) => {
      if (response.operationKind === OperationKind.Event) {
        newEvent.next(response);
      } else {
        newResponse.next(response);
      }
    }
  );

  clientLink.subscribeToEvent.mockImplementation(
    (request: OperationRequest) => {
      return newEvent.pipe(filter((res) => res.operationName === request.name));
    }
  );

  clientLink.sendRequest.mockImplementation((request) => {
    return new Promise((resolve) => {
      const sub = newResponse
        .pipe(filter((res) => res.request?.id === request.id))
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
