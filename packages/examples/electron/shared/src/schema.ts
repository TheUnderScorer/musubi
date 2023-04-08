import { command, defineSchema } from '@musubi/core';
import { z } from 'zod';

export const electronSchema = defineSchema({
  commands: {
    closeWindow: command().withPayload(
      z.object({
        windowId: z.union([z.number(), z.literal('current')]),
      })
    ),
    closeApp: command(),
    openWindow: command()
      .withPayload(
        z.object({
          url: z.string(),
        })
      )
      .withResult(
        z.object({
          windowId: z.number(),
        })
      ),
  },
  events: {},
  queries: {},
});
