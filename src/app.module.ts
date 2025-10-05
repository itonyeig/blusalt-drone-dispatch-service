import { Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MemoryDbModule } from './database/memory-db.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { DroneModule } from './drone/drone.module';
import { MedicationModule } from './medication/medication.module';
import mongoose from 'mongoose';
import { SeedModule } from './seed/seed.module';

mongoose.set('strict', 'throw');
mongoose.plugin((schema) => {
  schema.set('timestamps', true);
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
    DispatchModule,
    DroneModule,
    MedicationModule,
    SeedModule,
  ],
})
export class AppModule implements OnApplicationShutdown {
  constructor(@Inject('MONGO_SERVER') private readonly mongod: MongoMemoryServer) {}

  async onApplicationShutdown() {
    await this.mongod.stop();
  }
}
