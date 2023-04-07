import { command, defineSchema } from '@musubi/core';
import { z } from 'zod';

export const electronSchema = defineSchema({
  commands: {
    closeWindow: command().withPayload(
      z.object({
        windowId: z.union([z.number(), z.literal('current')]),
      })
    ),
  },
  events: {},
  queries: {},
});
