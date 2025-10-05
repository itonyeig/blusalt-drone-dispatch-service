import { Controller, Post } from '@nestjs/common';
import { DroneService } from './drone.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('drone')
export class DroneController {
  constructor(private readonly droneService: DroneService) {}

  @Post()
  @ApiOperation({ summary: 'Test the Bull queue system' })
  create() {
    return this.droneService.create();
  }
}
