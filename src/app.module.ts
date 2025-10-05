import { Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
// import { DatabaseModule } from './database/database.module';
import { MemoryDbModule } from './database/memory-db.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { DroneModule } from './drone/drone.module';
import mongoose from 'mongoose';

// ─── Global Mongoose options ───────────────────────────────
mongoose.set('strict', 'throw'); // rejects unknown fields on writes
mongoose.plugin((schema) => {
  schema.set('timestamps', true); // Add createdAt / updatedAt to every schema automatically
});
@Module({
  imports: [
    MemoryDbModule,
    MongooseModule.forRootAsync({
      imports: [MemoryDbModule],
      inject: ['MONGO_SERVER'],
      useFactory: (mongod: MongoMemoryServer) => ({
        uri: mongod.getUri(),
        dbName: 'blusalt',
      }),
    }),
    // DatabaseModule,
    DispatchModule,
    DroneModule,
  ],
})
export class AppModule implements OnApplicationShutdown {
  constructor(@Inject('MONGO_SERVER') private readonly mongod: MongoMemoryServer) {}

  async onApplicationShutdown() {
    await this.mongod.stop();
  }
}
