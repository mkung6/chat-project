import Message from './message';
import NEW_MESSAGE from './schema';

let messages;

export const getMessages = ctx => {
  messages = ctx.db.all('SELECT id, author, entry FROM message')
    .then(result => result.map(r => new Message(r.id, r.author, r.entry)));
  return messages;
}

export const createMessage = async function (input, ctx) {
  await ctx.db.all('INSERT INTO message (author, entry) VALUES ($author, $entry)', {$author: input.author, $entry: input.entry});
  const message = await ctx.db.all('SELECT MAX(id) as id, author, entry FROM message')
    .then(result => new Message(result[0].id, result[0].author, result[0].entry));
  ctx.sub.pubsub.publish(NEW_MESSAGE, { messageSent: message });
  return message;
}

export const messageSent = (ctx) => 
  console.log(ctx.sub.pubsub.asyncIterator(NEW_MESSAGE));
