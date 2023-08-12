import { finalize, Subject } from 'rxjs';
import { OperationRequest } from '../shared/OperationRequest';
import { OperationResponse } from '../shared/OperationResponse';
import { ReceiverLink } from './receiver.types';
import { OperationName } from '../schema/schema.types';
import { isSubscription } from '../utils/isSubscription';

export class RootReceiverLink<Ctx = unknown> {
  readonly sendResponse: (
    response: OperationResponse<unknown, OperationRequest<unknown, Ctx>>
  ) => Promise<void>;

  constructor(private readonly links: ReceiverLink<Ctx>[]) {
    this.sendResponse = links
      .filter((link) => link.sendResponse)
      .reduceRight<
        (
          response: OperationResponse<unknown, OperationRequest<unknown, Ctx>>
        ) => Promise<void>
      >(
        (next, link) => {
          return async (
            response: OperationResponse<
              unknown,
              OperationRequest<unknown, Ctx>,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              any
            >
          ) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            await link.sendResponse!(response, next);
          };
        },
        () => {
          return Promise.resolve();
        }
      );
  }

  observeNewRequest(name: OperationName) {
    const newRequestSubject = new Subject<OperationRequest<unknown, Ctx>>();

    return this.links
      .filter((link) => link.receiveRequest)
      .reduceRight((next, link) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const observableOrSubscription = link.receiveRequest!(name, next);

        if (isSubscription(observableOrSubscription)) {
          return next.pipe(
            finalize(() => {
              observableOrSubscription.unsubscribe();
            })
          );
        }

        return observableOrSubscription;
      }, newRequestSubject.asObservable())
      .pipe(
        finalize(() => {
          newRequestSubject.complete();
        })
      );
  }
}
