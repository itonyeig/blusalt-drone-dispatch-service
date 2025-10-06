import { Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { MemoryDbModule } from './database/memory-db.module';
import { DispatchModule } from './dispatch/dispatch.module';
import mongoose from 'mongoose';
import { SeedModule } from './seed/seed.module';
import { CronModule } from './cron/cron.module';
import { DroneModule } from './drone/drone.module';
import { MedicationModule } from './medication/medication.module';

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
      useFactory: (replSet: MongoMemoryReplSet) => ({
        uri: replSet.getUri(),
        dbName: 'blusalt',
      }),
    }),
    DroneModule,
    MedicationModule,
    DispatchModule,
    SeedModule,
    CronModule,
  ],
})
export class AppModule implements OnApplicationShutdown {
  constructor(@Inject('MONGO_SERVER') private readonly replSet: MongoMemoryReplSet) {}

  async onApplicationShutdown() {
    await this.replSet.stop();
  }
}
