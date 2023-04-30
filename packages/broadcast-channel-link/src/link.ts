import { CommunicationChannel } from './types';
import { LinkPair } from '@musubi/core';
import { BroadcastChannelReceiverLink } from './BroadcastChannelReceiverLink';
import { BroadcastChannelClientLink } from './BroadcastChannelClientLink';

export function createBroadcastChannelLink(
  broadcastChannel: CommunicationChannel
): LinkPair<BroadcastChannelClientLink, BroadcastChannelReceiverLink> {
  return {
    receiver: new BroadcastChannelReceiverLink(broadcastChannel),
    client: new BroadcastChannelClientLink(broadcastChannel),
  };
}
