import { Subject } from 'rxjs';
import { OperationRequest } from '../shared/OperationRequest';
import { OperationResponse } from '../shared/OperationResponse';
import { ReceiverLink } from './receiver.types';
import { OperationName } from '../schema/schema.types';

export class RootReceiverLink {
  readonly sendResponse: (response: OperationResponse) => Promise<void>;

  constructor(private readonly links: ReceiverLink[]) {
    this.sendResponse = links.reduceRight<
      (response: OperationResponse) => Promise<void>
    >(
      (next, link) => {
        return async (response: OperationResponse) => {
          await link.sendResponse?.(response, next);
        };
      },
      () => {
        return Promise.resolve();
      }
    );
  }

  observeNewRequest(name: OperationName) {
    const newRequestSubject = new Subject<OperationRequest>().asObservable();

    return this.links.reduceRight((next, link) => {
      return link.receiveRequest(name, next);
    }, newRequestSubject);
  }
}
