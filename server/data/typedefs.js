export default `
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
`;
