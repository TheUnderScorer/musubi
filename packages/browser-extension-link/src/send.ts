import { BrowserExtensionChannel } from './channel';
import * as browser from 'webextension-polyfill';

export async function sendMessage<T>(
  message: T,
  channel: BrowserExtensionChannel,
  currentChannel: BrowserExtensionChannel
) {
  if (channel.type === currentChannel.type) {
    // TODO Test it in the same channel (e.g cs to cs, or popup to popup)
    await browser.runtime.sendMessage(message);

    return;
  }

  switch (channel.type) {
    case 'background':
    case 'currentContext':
    case 'popup':
      await browser.runtime.sendMessage(message);

      break;

    case 'tab': {
      const { tabId, frameId } = channel;

      const tab = await browser.tabs.get(tabId).catch((error) => {
        console.error('Failed to get tab', error);

        return null;
      });

      if (!tab?.id) {
        return;
      }

      try {
        await browser.tabs.sendMessage(tab.id, message, {
          frameId: frameId === 'allFrames' ? undefined : frameId,
        });
      } catch (error) {
        console.error('Failed to send message to tab', error);
      }
    }
  }
}

export async function sendMessageEverywhere<T>(message: T) {
  await browser.runtime.sendMessage(message);

  const tabs = await browser.tabs?.query({}).catch((error) => {
    console.error(error);

    return null;
  });

  if (tabs?.length) {
    await Promise.all(
      tabs.map((tab) =>
        browser.tabs.sendMessage(tab.id as number, message).catch((error) => {
          console.error(error);
        })
      )
    );
  }
}
