import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Drone, DroneSchema } from '../drone/schemas/drone.schema';
import { Medication, MedicationSchema } from '../medication/schema/medication.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Drone.name, schema: DroneSchema },
      { name: Medication.name, schema: MedicationSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
