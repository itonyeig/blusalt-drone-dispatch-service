import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ResponseFormatter } from 'src/common/response-formatter';
import { DispatchService } from './dispatch.service';
import { LoadDroneDto } from './dto/load-drone.dto';
import { DroneByIdGuard } from './guards/drone-by-id.guard';
import { IdleDroneGuard } from './guards/idle-drone.guard';
import { DroneBatteryGuard } from './guards/drone-battery.guard';

@ApiTags('Dispatch')
@Controller('dispatch')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Get('status')
  getStatus() {
    return { status: 'Dispatch service is running' };
  }
}
