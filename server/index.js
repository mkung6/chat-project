import express from 'express';
import express_graphql from 'express-graphql';
import sqlite from 'sqlite';
import cors from 'cors';
import { GraphQLServer, PubSub } from 'graphql-yoga';
// import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { schema, root } from './data/schema';
import typeDefs from './data/typedefs';
import resolvers from './data/resolver';

const GRAPHQL_PORT = 4000;
const pubsub = new PubSub();

sqlite.open(':memory:', { cached: true })
  .then(() => sqlite.migrate())
  .then(() => {
    const server = new GraphQLServer({
      typeDefs,
      resolvers,
      context: {
        db: {
          get: (...args) => sqlite.get(...args),
          all: (...args) => sqlite.all(...args),
          run: (...args) => sqlite.run(...args)
        },
        sub: {
          pubsub
        }
      }
    });
    server.start(() =>
      console.log(
        `GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`
      ));

    // const graphQLApp = express();
    // graphQLApp.use(cors());
    // graphQLApp.use('/', express_graphql({
    //   graphiql: true,
    //   pretty: true,
    //   schema: schema,
    //   rootValue: root,
    //   context: {
    //     db: {
    //       get: (...args) => sqlite.get(...args),
    //       all: (...args) => sqlite.all(...args),
    //       run: (...args) => sqlite.run(...args)
    //     },
    //     sub: {
    //       pubsub
    //     }
    //   }
    // }));
    //
    // graphQLApp.listen(GRAPHQL_PORT, () => {
    //   console.log(
    //     `GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`
    //   );
    // });
    // SubscriptionServer.create(
    //   {
    //     schema,
    //     execute,
    //     subscribe
    //   },
    //   {
    //     server: graphQLApp,
    //     path: '/graphql'
    //   }
    // );
  })
  .catch(e => console.error(e));
