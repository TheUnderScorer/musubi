import { OperationsSchema } from '@musubi/core';
import { Tabs } from 'webextension-polyfill';
import { BrowserExtensionChannel } from './channel';

export type ChannelResolver = (
  currentChannel: BrowserExtensionChannel,
  currentTab?: Tabs.Tab
) => BrowserExtensionChannel;

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

export function defineDefaultChannels<S extends OperationsSchema>(
  channels: DefaultChannels<S>
) {
  return channels;
}

export function getDefaultChannel<
  S extends OperationsSchema,
  Kind extends keyof DefaultChannels<S>
>(
  defaultChannels: DefaultChannels<S>,
  kind: Kind,
  operation: keyof S[Kind],
  currentChannel: BrowserExtensionChannel,
  currentTab?: Tabs.Tab
): BrowserExtensionChannel {
  const resolver = defaultChannels?.[kind]?.[operation];

  console.log('getDefaultChannel', {
    defaultChannels,
    kind,
    operation,
    resolver,
    currentChannel,
    currentTab,
  });

  if (resolver) {
    return typeof resolver === 'function'
      ? resolver(currentChannel, currentTab)
      : resolver;
  }

  return currentChannel;
}
