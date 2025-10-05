import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Boots a throw-away mongod in RAM and exposes it as DI token `MONGO_SERVER`.
 */
export const MemoryMongoProvider = {
  provide: 'MONGO_SERVER',
  useFactory: async () => MongoMemoryServer.create(),
};
