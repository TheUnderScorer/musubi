import { Subscription } from 'rxjs';

export function isSubscription(value: unknown): value is Subscription {
  return Boolean(value && value instanceof Subscription);
}
