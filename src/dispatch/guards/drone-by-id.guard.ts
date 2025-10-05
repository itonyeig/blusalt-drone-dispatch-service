import { CanActivate, ExecutionContext, Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { isValidObjectId, Model } from 'mongoose';
import { Drone, DroneDocument } from '../../drone/schemas/drone.schema';

@Injectable()
export class DroneByIdGuard implements CanActivate {
  private readonly logger = new Logger(DroneByIdGuard.name);

  constructor(@InjectModel(Drone.name) private readonly droneModel: Model<DroneDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { droneId } = request.params;

    if (!isValidObjectId(droneId)) {
      throw new BadRequestException('Invalid drone identifier supplied');
    }

    const drone = await this.droneModel.findById(droneId);
    if (!drone) {
      this.logger.debug(`Drone not found for id ${droneId}`);
      throw new NotFoundException(`Drone with id ${droneId} not found`);
    }

    request.drone = drone;
    return true;
  }
}
