import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DroneService } from './drone.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDroneDto } from './dto/create-drone.dto';
import { ResponseFormatter } from 'src/common/response-formatter';
import { GetAllDronesDto } from './dto/get-drones.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Drone')
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

  @Get('drone-audit')
  @ApiOperation({ summary: 'Get paginated battery audit trail for drones' })
  async getAudit(@Query() query: PaginationDto) {
    const data = await this.droneService.getDroneAudit(query);
    return ResponseFormatter.Ok({ data });
  }
}
