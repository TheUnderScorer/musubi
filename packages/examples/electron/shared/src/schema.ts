import { command, defineSchema, event, query } from '@musubi/core';
import { z } from 'zod';

export const electronSchema = defineSchema({
  commands: {
    closeApp: command(),
    maximize: command(),
  },
  events: {
    timerIncremented: event().withPayload(z.number().int()),
    mouseClickedInRenderer: event().withPayload(
      z.object({
        x: z.number(),
        y: z.number(),
      })
    ),
  },
  queries: {
    getWindowTimerValue: query().withResult(z.number().int()),
  },
});
