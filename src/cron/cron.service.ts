import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Drone, DroneDocument } from '../drone/schemas/drone.schema';
import {
  AuditBattery,
  AuditBatteryDocument,
} from '../drone/schemas/audit-battery.schema';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @InjectModel(Drone.name) private readonly droneModel: Model<DroneDocument>,
    @InjectModel(AuditBattery.name) private readonly auditModel: Model<AuditBatteryDocument>,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'droneBatteryAudit',
    timeZone: 'Africa/Lagos',
  })
  async auditBatteryLevels() {
    const drones = await this.droneModel.find({}, { battery: 1 }).lean();

    if (!drones.length) {
      this.logger.debug('[Cron] No drones found for battery audit');
      return;
    }

    const auditDocs = drones.map((drone) => ({
      drone: drone._id,
      battery: drone.battery,
    } satisfies AuditBattery));

    await this.auditModel.create(auditDocs);
    this.logger.debug(`[Cron] Captured battery levels for ${auditDocs.length} drones`);
  }
}
