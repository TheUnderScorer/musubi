import { InMemoryReceiverLink } from './InMemoryReceiverLink';
import { createHandlers } from './handlers';
import { InMemoryClientLink } from './InMemoryClientLink';

export function createInMemoryLink() {
  const handlers = createHandlers();

  return {
    receiver: new InMemoryReceiverLink(handlers),
    client: new InMemoryClientLink(handlers),
  };
}
