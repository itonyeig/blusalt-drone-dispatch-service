import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CronService } from './cron.service';
import { Drone, DroneSchema } from '../drone/schemas/drone.schema';
import { AuditBatteryName, AuditBatterySchema } from '../drone/schemas/audit-battery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Drone.name, schema: DroneSchema },
      { name: AuditBatteryName, schema: AuditBatterySchema },
    ]),
  ],
  providers: [CronService],
})
export class CronModule {}
