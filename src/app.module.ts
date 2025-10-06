import { Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { MemoryDbModule } from './database/memory-db.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DispatchModule } from './dispatch/dispatch.module';
import { DroneModule } from './drone/drone.module';
import { MedicationModule } from './medication/medication.module';
import { CronModule } from './cron/cron.module';
import { SeedModule } from './seed/seed.module';

mongoose.set('strict', 'throw');
mongoose.plugin((schema) => {
  schema.set('timestamps', true);
});

@Module({
  imports: [
    MemoryDbModule,
    ScheduleModule.forRoot(),
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
    CronModule,
    SeedModule,
  ],
})
export class AppModule implements OnApplicationShutdown {
  constructor(@Inject('MONGO_SERVER') private readonly replSet: MongoMemoryReplSet) {}

  async onApplicationShutdown() {
    await this.replSet.stop();
  }
}
