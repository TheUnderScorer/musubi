import { z } from 'zod';

export const electronChannelSchema = z.number();

export type ElectronChannel = z.infer<typeof electronChannelSchema>;

export const ELECTRON_MESSAGE_CHANNEL = 'musubi-electron-message';
