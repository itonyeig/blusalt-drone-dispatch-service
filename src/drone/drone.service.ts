import { Injectable } from '@nestjs/common';
import { Drone, DroneDocument } from './schemas/drone.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDroneDto } from './dto/create-drone.dto';
import { DroneState } from './enums/drone-state.enum';
import { DroneModel } from './enums/drone-model.enum';
import { randomBytes } from 'crypto';
import { GetAllDronesDto } from './dto/get-drones.dto';
import { paginate } from 'src/utils/pagination.helper';

@Injectable()
export class DroneService {
  constructor(@InjectModel(Drone.name) private droneModel: Model<DroneDocument>){}

  async create(dto: CreateDroneDto){
    const sn = await this.generateSerialNumber()
    const droneData: Drone = {
      model: dto.model,
      battery: 100,
      state: DroneState.IDLE,
      weightLimit: this.droneCapacity(dto.model),
      serialNumber: sn
    }
    const drone = await this.droneModel.create(droneData);
    return drone;
  }

  async getDrones(dto: GetAllDronesDto){
    const { model } = dto;
    const query: Partial<Drone> = {};

    if (model) {
      query.model = model;
    }

    const drones = await paginate(this.droneModel, query, dto);
    return drones;
  }

  private droneCapacity(model: DroneModel): number {
    switch (model) {
      case DroneModel.LIGHTWEIGHT:
        return 200;
      case DroneModel.MIDDLEWEIGHT:
        return 300;
      case DroneModel.CRUISERWEIGHT:
        return 400;
      case DroneModel.HEAVYWEIGHT:
        return 500;
      default:
        throw new Error(`Unknown drone model: ${model as string}`);
    }
  }

  private async generateSerialNumber(): Promise<string> {
    const serialNumber = 'DRN' + randomBytes(6).toString('hex').toUpperCase();
    const doc = await this.droneModel.exists({ serialNumber });

    if (doc) {
      return this.generateSerialNumber();
    }

    return serialNumber;
  }

}



