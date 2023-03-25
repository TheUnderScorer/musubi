import { command, defineSchema, event, query } from '@musubi/core';
import { z } from 'zod';
import {
  ChannelResolver,
  defineDefaultChannels,
} from '@musubi/browser-extension-link';

const replaceContentSchema = z.object({
  content: z.string(),
});

export const browserExtensionSchema = defineSchema({
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

export const defaultChannels = defineDefaultChannels<
  typeof browserExtensionSchema
>({
  queries: {
    getAllTabIds: {
      type: 'background',
    },
  },
  commands: {
    replaceContent: forCurrentTab,
    closeRightTab: {
      type: 'background',
    },
  },
});
