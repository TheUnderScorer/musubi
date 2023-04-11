import { OperationDefinition, OperationsSchema } from '@musubi/core';
import { Tabs } from 'webextension-polyfill';
import { BrowserExtensionChannel } from './channel';

export type ChannelResolver = (
  currentChannel: BrowserExtensionChannel,
  currentTab?: Tabs.Tab
) => BrowserExtensionChannel;

export interface BrowserExtensionLinkMeta {
  /**
   * Provides default channel that will be used by given schema operation
   * */
  browserExtensionChannel?: ChannelResolver | BrowserExtensionChannel;
}

export interface DefaultChannels<S extends OperationsSchema> {
  commands?: {
    [K in keyof S['commands']]?: ChannelResolver | BrowserExtensionChannel;
  };
  queries?: {
    [K in keyof S['queries']]?: ChannelResolver | BrowserExtensionChannel;
  };
  events?: {
    [K in keyof S['events']]?: ChannelResolver | BrowserExtensionChannel;
  };
}

export function getDefaultChannel<
  S extends OperationsSchema,
  Kind extends keyof S
>(
  schema: S,
  kind: Kind,
  operation: keyof S[Kind],
  currentChannel: BrowserExtensionChannel,
  currentTab?: Tabs.Tab
): BrowserExtensionChannel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meta = (schema?.[kind]?.[operation] as OperationDefinition<any>)?.meta;

  const resolver = (meta as BrowserExtensionLinkMeta)?.browserExtensionChannel;

  if (resolver) {
    return typeof resolver === 'function'
      ? resolver(currentChannel, currentTab)
      : resolver;
  }

  return currentChannel;
}
