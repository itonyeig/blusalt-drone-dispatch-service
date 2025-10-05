import { Module } from '@nestjs/common';
import { DroneService } from './drone.service';
import { DroneController } from './drone.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Drone, DroneSchema } from './schemas/drone.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Drone.name, schema: DroneSchema },
    ]),
  ],
  controllers: [DroneController],
  providers: [DroneService],
})
export class DroneModule {}
