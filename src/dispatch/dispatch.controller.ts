import { Body, Controller, Get, InternalServerErrorException, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import type { Request } from 'express';
import { ResponseFormatter } from 'src/common/response-formatter';
import { DispatchService } from './dispatch.service';
import { AvailableDronesDto, LoadDroneDto } from './dto/load-drone.dto';
import { DroneByIdGuard } from './guards/drone-by-id.guard';
import { IdleDroneGuard } from './guards/idle-drone.guard';
import { DroneBatteryGuard } from './guards/drone-battery.guard';

@Controller('dispatch')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Post(':droneId/load')
  @UseGuards(DroneByIdGuard, IdleDroneGuard, DroneBatteryGuard)
  @ApiOperation({ summary: 'Load a drone with medication items' })
  async loadDrone(@Req() req: Request, @Body() dto: LoadDroneDto, @Param('droneId') droneId: string) {
    if (!req.drone) {
      throw new InternalServerErrorException('Drone object not found');
    }
    const data = await this.dispatchService.loadDrone(req.drone, dto);
    return ResponseFormatter.Ok({ data });
  }

  @Get('available')
  @ApiOperation({ summary: 'List drones available for loading' })
  getAvailableDrones(@Query() dto: AvailableDronesDto) {
    try {
      this.dispatchService.getAvailableDrones(dto);
    } catch (error) {
      console.log(' an error occured in transit')
    }
    return ResponseFormatter.Ok({ message: 'drone has taken off' });
  }

  @Get(':droneId/items')
  @UseGuards(DroneByIdGuard)
  @ApiOperation({ summary: 'Retrieve loaded items for a drone' })
  async getLoadedItems(@Param('droneId') droneId: string) {
    const data = await this.dispatchService.getLoadedItems(droneId);
    return ResponseFormatter.Ok({ data });
  }

  @Get(':droneId/battery')
  @UseGuards(DroneByIdGuard)
  @ApiOperation({ summary: 'Check drone battery level' })
  getBatteryLevel(@Param('droneId') droneId: string, @Req() req: Request) {
    if (!req.drone) {
      throw new InternalServerErrorException('Drone object not found');
    }
    // const data = await this.dispatchService.getBatteryLevel(droneId);
    return ResponseFormatter.Ok({ data: req.drone.battery });
  }
}
