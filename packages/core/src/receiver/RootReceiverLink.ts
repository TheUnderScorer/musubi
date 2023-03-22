import { Observable, Subject } from 'rxjs';
import { OperationRequest } from '../shared/OperationRequest';
import { OperationResponse } from '../shared/OperationResponse';
import { ReceiverLink } from './receiver.types';

export class RootReceiverLink {
  readonly newRequest: Observable<OperationRequest>;

  readonly sendResponse: (response: OperationResponse) => Promise<void>;

  constructor(links: ReceiverLink[]) {
    const newRequestSubject = new Subject<OperationRequest>().asObservable();

    this.newRequest = links.reduceRight((next, link) => {
      return link.receiveRequest(next);
    }, newRequestSubject);

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
}
