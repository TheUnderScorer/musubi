export type CommunicationChannel = Pick<
  BroadcastChannel,
  'addEventListener' | 'postMessage' | 'removeEventListener'
>;

export interface BroadcastChannelLinkContext {
  message: MessageEvent;
}
