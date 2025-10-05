import { Body, Controller, Post } from '@nestjs/common';
import { DroneService } from './drone.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateDroneDto } from './dto/create-drone.dto';
import { ResponseFormatter } from 'src/common/response-formatter';

@Controller('drone')
export class DroneController {
  constructor(private readonly droneService: DroneService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new drone' })
  async create(@Body() createDroneDto: CreateDroneDto) {
    const data = await this.droneService.create(createDroneDto);
    return ResponseFormatter.Ok({ data });
  }
}
