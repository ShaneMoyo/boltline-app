import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import {
  baseTypeDefs,
  partsTypeDefs,
  bomTypeDefs,
  inventoryTypeDefs,
  workOrderTypeDefs,
  dashboardTypeDefs,
  authTypeDefs,
} from './schema/index.js';
import depthLimit from 'graphql-depth-limit';
import { resolvers } from './resolvers/index.js';
import { createContext } from './lib/context.js';
import { formatError } from './lib/formatError.js';

const server = new ApolloServer({
  typeDefs: [
    baseTypeDefs,
    partsTypeDefs,
    bomTypeDefs,
    inventoryTypeDefs,
    workOrderTypeDefs,
    dashboardTypeDefs,
    authTypeDefs,
  ],
  resolvers,
  formatError,
  validationRules: [depthLimit(10)],
  introspection: process.env.NODE_ENV !== 'production',
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => createContext(req),
});

console.log(`🚀  API server ready at ${url}`);
