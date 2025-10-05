import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DispatchController } from './dispatch.controller';
import { DispatchService } from './dispatch.service';
import { DispatchJob, DispatchJobSchema } from './schema/dispatch-job.schema';
import { Drone, DroneSchema } from '../drone/schemas/drone.schema';
import { Medication, MedicationSchema } from '../medication/schema/medication.schema';
import { DroneByIdGuard } from './guards/drone-by-id.guard';
import { IdleDroneGuard } from './guards/idle-drone.guard';
import { DroneBatteryGuard } from './guards/drone-battery.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DispatchJob.name, schema: DispatchJobSchema },
      { name: Drone.name, schema: DroneSchema },
      { name: Medication.name, schema: MedicationSchema },
    ]),
  ],
  controllers: [DispatchController],
  providers: [DispatchService, DroneByIdGuard, IdleDroneGuard, DroneBatteryGuard],
})
export class DispatchModule {}
