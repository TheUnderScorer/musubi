import { z } from 'zod';

export const browserExtensionChannelSchema = z.union([
  z.object({
    type: z.literal('popup'),
  }),
  z.object({
    type: z.literal('currentContext'),
  }),
  z.object({
    type: z.literal('background'),
  }),
  z.object({
    type: z.literal('tab'),
    tabId: z.number().int(),
    frameId: z.union([
      z.number().int().default(0).optional(),
      z.literal('allFrames'),
    ]),
  }),
]);

export const browserExtensionChannel = <C extends BrowserExtensionChannel>(
  channel: C
) => channel;

/**
 * Channel can be either:
 *
 * - popup
 * - currentContext (message will be passed in the same context)
 * - background (service worker or background script)
 * - tab (content script running on a specific tab and frame)
 *
 * */
export type BrowserExtensionChannel = z.infer<
  typeof browserExtensionChannelSchema
>;

export type BrowserExtensionChannelType = BrowserExtensionChannel['type'];
