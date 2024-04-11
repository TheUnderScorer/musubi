/* eslint-disable @typescript-eslint/no-explicit-any */
import { BroadcastChannelLinkContext, CommunicationChannel } from './types';
import { setupTestUserHandlers, testSchema } from 'tools/test/testMusubi';
import { createMusubi, Musubi } from '@musubi/core';
import { createBroadcastChannelLink } from './link';

function createFakeChannel(): CommunicationChannel {
  const target = new EventTarget();

  return {
    postMessage: (msg) => {
      target.dispatchEvent(new MessageEvent('message', { data: msg }));
    },
    addEventListener: (type: any, listener: any) => {
      return target.addEventListener(type, listener);
    },
    removeEventListener: (type: any, listener: any) => {
      return target.removeEventListener(type, listener);
    },
  };
}

let channel: CommunicationChannel;

let musubi: Musubi<
  typeof testSchema,
  BroadcastChannelLinkContext,
  BroadcastChannelLinkContext
>;

describe('Broadcast channel link', () => {
  beforeEach(() => {
    channel = createFakeChannel();

    const link = createBroadcastChannelLink(channel);

    musubi = createMusubi({
      schema: testSchema,
      clientLinks: [link.client],
      receiverLinks: [link.receiver],
    });

    setupTestUserHandlers(musubi.receiver);
  });

  it('should send and receive operations', async () => {
    const onUserCreated = jest.fn();

    musubi.client.observeEvent('userCreated').subscribe(onUserCreated);

    const user = await musubi.client.command('createUser', {
      name: 'test',
    });

    expect(user.name).toEqual('test');
    expect(onUserCreated).toHaveBeenCalledTimes(1);
  });
});
