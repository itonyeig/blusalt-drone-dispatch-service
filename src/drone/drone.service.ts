import { Injectable } from '@nestjs/common';
import { Drone, DroneDocument } from './schemas/drone.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DroneService {
  constructor(@InjectModel(Drone.name) private droneModel: Model<DroneDocument>){}

  create(dto: ){

  }
}
