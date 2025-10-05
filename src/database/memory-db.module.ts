import { Module, Global } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Global()
@Module({
  providers: [
    {
      provide: 'MONGO_SERVER',
      useFactory: async () => MongoMemoryServer.create(),
    },
  ],
  exports: ['MONGO_SERVER'],
})
export class MemoryDbModule {}