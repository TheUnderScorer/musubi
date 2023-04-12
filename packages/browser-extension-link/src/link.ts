import {
  BrowserExtensionChannel,
  BrowserExtensionChannelType,
} from './channel';
import { BrowserExtensionReceiverLink } from './BrowserExtensionReceiverLink';
import { BrowserExtensionClientLink } from './BrowserExtensionClientLink';
import { LinkFnParams } from '@musubi/core';

export function createBrowserExtensionLink(
  currentChannel: BrowserExtensionChannelType
) {
  let channel: BrowserExtensionChannel;

  if (currentChannel === 'tab') {
    channel = {
      // We don't need to check for tab id, so let's just use 0
      tabId: 0,
      type: 'tab',
    };
  } else {
    channel = {
      type: currentChannel,
    };
  }

  return {
    receiver: new BrowserExtensionReceiverLink(channel),
    client: ({ schema }: LinkFnParams) =>
      new BrowserExtensionClientLink(channel, schema),
  };
}
