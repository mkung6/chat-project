import { buildSchema } from 'graphql';
import { getMessages, createMessage } from './api';

export const schema = buildSchema(`
    type Message {
        id: Int!
        author: String!
        entry: String
    }
    type Query {
        messages: [Message]
    }
    type Mutation {
      createMessage(author: String!, entry: String!): Message
    }
    type Subscription {
      messageSent: Message
    }
`);

export const NEW_MESSAGE = 'NEW_MESSAGE';

export const root = {
  messages: (obj, ctx) => getMessages(ctx),
  createMessage: (obj, ctx) => createMessage(obj, ctx),
  messageSent: (obj, ctx) => messageSent(ctx)
};

// createMessage: (obj, ctx, { pubsub }) => createMessage(obj, ctx, { pubsub }),
// messageSent: {
//   subscribe: (root, args, { pubsub }) => {
//     return pubsub.asyncIterator(NEW_MESSAGE)
//   }
// }
