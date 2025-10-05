import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DroneService } from './drone.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateDroneDto } from './dto/create-drone.dto';
import { ResponseFormatter } from 'src/common/response-formatter';
import { GetAllDronesDto } from './dto/get-drones.dto';

@Controller('drone')
export class DroneController {
  constructor(private readonly droneService: DroneService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new drone' })
  async create(@Body() createDroneDto: CreateDroneDto) {
    const data = await this.droneService.create(createDroneDto);
    return ResponseFormatter.Ok({ data });
  }

  @Get()
  @ApiOperation({ summary: 'Get all paginated drones' })
  async getAll(@Query() getAllDronesDto: GetAllDronesDto) {
    const data = await this.droneService.getDrones(getAllDronesDto);
    return ResponseFormatter.Ok({ data });
  }
}
