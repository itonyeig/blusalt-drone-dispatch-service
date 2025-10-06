import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DroneService } from './drone.service';
import { DroneController } from './drone.controller';
import { Drone, DroneSchema } from './schemas/drone.schema';
import { AuditBattery, AuditBatterySchema } from './schemas/audit-battery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Drone.name, schema: DroneSchema },
      { name: AuditBattery.name, schema: AuditBatterySchema },
    ]),
  ],
  controllers: [DroneController],
  providers: [DroneService],
})
export class DroneModule {}
