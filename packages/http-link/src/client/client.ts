import { HttpClientLinkOptions } from './client.types';
import { HttpClientLink } from './HttpClientLink';
import { LinkParam } from '@musubi/core';

/**
 * Creates new http client link
 *
 * @example
 * ```
 * import { createHttpClientLink } from '@musubi/http-link';
 * import { schema } from './schema'
 * import { MusubiClient } from '@musubi/core';
 *
 * const link = createHttpClientLink({
 *    url: 'http://localhost:3000',
 *    headers: {
 *      'Content-Type': 'application/json',
 *    },
 *    fetch: window.fetch,
 * });
 *
 * const client = new MusubiClient(schema, [link]);
 * */
export function createHttpClientLink(
  options: HttpClientLinkOptions
): LinkParam<HttpClientLink> {
  return ({ schema }) => new HttpClientLink(options, schema);
}

export * from './client.types';
export * from './HttpClientLink';
