import { Global, Module } from '@nestjs/common';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

@Global()
@Module({
  providers: [
    {
      provide: 'MONGO_SERVER',
      useFactory: async () => {
        const replSet = await MongoMemoryReplSet.create({
          replSet: { storageEngine: 'wiredTiger' },
        });
        return replSet;
      },
    },
  ],
  exports: ['MONGO_SERVER'],
})
export class MemoryDbModule {}
