import Message from './message';
export const NEW_MESSAGE = 'NEW_MESSAGE';

export default {
  Query: {
    messages: async function (root, args, ctx) {
      const messages = await ctx.db.all('SELECT id, author, entry FROM message')
        .then(result => result.map(r => new Message(r.id, r.author, r.entry)));
      return messages;
    }
  },
  Mutation: {
    createMessage: async function (root, { author, entry } , ctx) {
      await ctx.db.all('INSERT INTO message (author, entry) VALUES ($author, $entry)', {$author: author, $entry: entry});
      const message = await ctx.db.all('SELECT MAX(id) as id, author, entry FROM message')
        .then(result => new Message(result[0].id, result[0].author, result[0].entry));
      ctx.sub.pubsub.publish(NEW_MESSAGE, { messageSent: message });
      return message;
    }
  },
  Subscription: {
    messageSent: {
      subscribe: (root, args, ctx) => {
        return ctx.sub.pubsub.asyncIterator(NEW_MESSAGE);
      }
    }
  }
}
