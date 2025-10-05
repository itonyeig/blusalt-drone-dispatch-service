import { BadRequestException, CanActivate, ExecutionContext, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { DroneState } from '../../drone/enums/drone-state.enum';

@Injectable()
export class IdleDroneGuard implements CanActivate {
  private readonly logger = new Logger(IdleDroneGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const drone = request.drone;

    if (!drone) {
      throw new NotFoundException('Drone must be resolved before checking idle state');
    }

    if (drone.state !== DroneState.IDLE) {
      this.logger.debug(`Drone ${drone._id.toString()} is not idle (current state: ${drone.state})`);
      throw new BadRequestException('Drone is not idle and cannot accept new load');
    }

    return true;
  }
}
