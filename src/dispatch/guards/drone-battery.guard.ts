import { CanActivate, ExecutionContext, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { MIN_BATTERY_TO_LOAD } from '../constants/dispatch.constants';

@Injectable()
export class DroneBatteryGuard implements CanActivate {
  private readonly logger = new Logger(DroneBatteryGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const drone = request.drone;

    if (!drone) {
      throw new NotFoundException('Drone must be resolved before checking battery level');
    }

    if (drone.battery < MIN_BATTERY_TO_LOAD) {
      this.logger.debug(`Drone ${drone._id.toString()} battery too low (${drone.battery}%)`);
      throw new NotFoundException('Drone battery level is below the permitted threshold');
    }

    return true;
  }
}
