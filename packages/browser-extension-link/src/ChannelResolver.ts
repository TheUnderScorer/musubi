import { BrowserExtensionChannel } from './channel';
import { DefaultChannels, getDefaultChannel } from './defaultChannel';
import {
  OperationKind,
  OperationName,
  OperationsSchema,
  resolveSchemaKey,
} from '@musubi/core';
import { getCurrentTab } from './tabs';

export class ChannelResolver<S extends OperationsSchema> {
  constructor(
    private readonly currentChannel: BrowserExtensionChannel,
    private readonly defaultChannels: DefaultChannels<S> = {
      commands: {},
      events: {},
      queries: {},
    }
  ) {}

  async resolve(
    kind: OperationKind,
    name: OperationName,
    passedChannel?: BrowserExtensionChannel
  ) {
    if (passedChannel) {
      return passedChannel;
    }

    const currentTab = await getCurrentTab();

    const result = getDefaultChannel(
      this.defaultChannels,
      resolveSchemaKey(kind),
      name,
      this.currentChannel,
      currentTab
    );

    console.log('ChannelResolver.resolve', { result });

    return result;
  }
}
