import {
  command,
  defineSchema,
  event,
  extendSchema,
  query,
} from '@musubi/core';
import { z } from 'zod';
import {
  BrowserExtensionLinkMeta,
  ChannelResolver,
} from '@musubi/browser-extension-link';

const replaceContentSchema = z.object({
  content: z.string(),
});

/**
 * As an example, baseSchema doesn't contain meta from browser extension link
 * */
const baseSchema = defineSchema({
  commands: {
    replaceContent: command()
      .withPayload(replaceContentSchema)
      .withResult<void>(),
    closeRightTab: command(),
  },
  events: {
    tabCreated: event().withPayload(
      z.object({
        id: z.number(),
      })
    ),
    contentReplaced: event(),
  },
  queries: {
    getAllTabIds: query().withResult(z.array(z.number())),
  },
});

const forCurrentTab: ChannelResolver = (currentChannel, currentTab) => {
  return currentTab?.id
    ? {
        type: 'tab',
        tabId: currentTab.id,
      }
    : currentChannel;
};

// Extended base schema which adds metadata used by browser extension link
export const browserExtensionSchema = extendSchema(baseSchema, {
  commands: {
    replaceContent: (def) =>
      def.withMeta<BrowserExtensionLinkMeta>({
        browserExtensionChannel: forCurrentTab,
      }),

    closeRightTab: (def) =>
      def.withMeta<BrowserExtensionLinkMeta>({
        browserExtensionChannel: {
          type: 'background',
        },
      }),
  },
  queries: {
    getAllTabIds: (def) =>
      def.withMeta<BrowserExtensionLinkMeta>({
        browserExtensionChannel: {
          type: 'background',
        },
      }),
  },
});
