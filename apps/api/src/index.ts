import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import depthLimit from 'graphql-depth-limit';
import {
  baseTypeDefs,
  partsTypeDefs,
  bomTypeDefs,
  inventoryTypeDefs,
  workOrderTypeDefs,
  dashboardTypeDefs,
  authTypeDefs,
} from './schema/index.js';
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

await server.start();

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
    credentials: true,
  }),
);
app.use(rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false }));
app.use(express.json());

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => createContext(req),
  }),
);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`🚀  API server ready at http://localhost:${PORT}/graphql`);
});
