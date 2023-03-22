import { z } from 'zod';
import { command, defineSchema, query } from '../schema/schemaHelpers';

const User = z.object({
  id: z.string(),
  name: z.string(),
});

const Post = z.object({
  id: z.string(),
  title: z.string(),
});

export const testUserSchema = defineSchema({
  commands: {
    createUser: command()
      .withPayload(
        z.object({
          name: z.string(),
        })
      )
      .withResult(User),
  },
  events: {
    userCreated: event().withPayload(User),
  },
  queries: {
    getUser: query()
      .withPayload(
        z.object({
          id: z.string(),
        })
      )
      .withResult(User),
  },
});

export const testPostSchema = defineSchema({
  commands: {
    createPost: command()
      .withPayload(
        z.object({
          title: z.string(),
        })
      )
      .withResult(Post),
  },
  events: {
    postCreated: event().withPayload(Post),
  },
  queries: {
    getPost: query()
      .withPayload(
        z.object({
          id: z.string(),
        })
      )
      .withResult(Post),
  },
});
