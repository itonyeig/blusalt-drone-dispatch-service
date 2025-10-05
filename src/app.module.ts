import { Module, Inject, OnApplicationShutdown } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MemoryDbModule } from './database/memory-db.module';

@Module({
  imports: [
    MemoryDbModule,
    MongooseModule.forRootAsync({
      imports: [MemoryDbModule],
      inject: ['MONGO_SERVER'],
      useFactory: (mongod: MongoMemoryServer) => ({
        uri: mongod.getUri(), // get the in-memory MongoDB URI
        dbName: 'blusalt',
      }),
    }),
  ],
})
export class AppModule implements OnApplicationShutdown {
  constructor(@Inject('MONGO_SERVER') private readonly mongod: MongoMemoryServer) {}
  
  async onApplicationShutdown() {
    await this.mongod.stop(); // wipes the RAM DB
  }
}
