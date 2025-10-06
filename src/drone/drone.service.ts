import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { randomBytes } from 'crypto';
import { Drone, DroneDocument } from './schemas/drone.schema';
import { CreateDroneDto } from './dto/create-drone.dto';
import { DroneState } from './enums/drone-state.enum';
import { GetAllDronesDto } from './dto/get-drones.dto';
import { paginate } from 'src/utils/pagination.helper';
import { handleDuplicateError } from 'src/utils/helper.utils';
import { droneCapacity } from 'src/utils/drone.utils';
import { AuditBatteryDocument, AuditBattery } from './schemas/audit-battery.schema';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class DroneService {
  constructor(
    @InjectModel(Drone.name) private readonly droneModel: Model<DroneDocument>,
    @InjectModel(AuditBattery.name) private readonly auditModel: Model<AuditBatteryDocument>,
  ) {}

  async create(dto: CreateDroneDto) {
    try {
      const serialNumber = dto.serialNumber ?? (await this.generateSerialNumber());
      const droneData: Drone = {
        serialNumber,
        model: dto.model,
        battery: 100,
        state: DroneState.IDLE,
        weightLimit: droneCapacity(dto.model),
      }
      const drone = await this.droneModel.create(droneData);
      return drone;
    } catch (error) {
      handleDuplicateError(error);
    }
  }

  async getDrones(dto: GetAllDronesDto) {
    const { model } = dto;
    const query: Partial<Drone> = {};

    if (model) {
      query.model = model;
    }

    return paginate(this.droneModel, query, dto);
  }

  async getDroneAudit(paginationquery: PaginationDto) {

    return paginate(this.auditModel, {}, paginationquery, {
      sort: { createdAt: -1 },
    });
  }

  private async generateSerialNumber(): Promise<string> {
    const serialNumber = 'DRN-' + randomBytes(6).toString('hex').toUpperCase();
    const doc = await this.droneModel.exists({ serialNumber });

    if (doc) {
      return this.generateSerialNumber();
    }

    return serialNumber;
  }
}
