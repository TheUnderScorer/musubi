import { z } from 'zod';
import { browserExtensionChannelSchema } from './channel';

export const browserExtensionContextSchema = z.object({
  senderTabId: z.number().int().optional(),
  resultName: z.string().optional(),
  sentFromChannel: browserExtensionChannelSchema.optional(),
});

export type BrowserExtensionContext = z.infer<
  typeof browserExtensionContextSchema
>;
