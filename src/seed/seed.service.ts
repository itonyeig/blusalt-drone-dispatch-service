import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Drone, DroneDocument } from '../drone/schemas/drone.schema';
import { DroneModel } from '../drone/enums/drone-model.enum';
import { DroneState } from '../drone/enums/drone-state.enum';
import { droneCapacity } from '../utils/drone.utils';
import { Medication, MedicationDocument } from '../medication/schema/medication.schema';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Drone.name) private readonly droneModel: Model<DroneDocument>,
    @InjectModel(Medication.name) private readonly medicationModel: Model<MedicationDocument>,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  private async seed() {
    this.logger.debug('Starting database seed');

    await Promise.all([this.seedDrones(), this.seedMedications()]);

    const [droneCount, medicationCount] = await Promise.all([
      this.droneModel.countDocuments(),
      this.medicationModel.countDocuments(),
    ]);

    this.logger.debug(`Seeding completed. Drones: ${droneCount}, Medications: ${medicationCount}`);
  }

  private async seedDrones() {
    const droneSeeds: Omit<Drone, 'state'>[] = [
      {
        serialNumber: 'DRN-0001',
        model: DroneModel.LIGHTWEIGHT,
        weightLimit: droneCapacity(DroneModel.LIGHTWEIGHT),
        battery: 100,
        // state: DroneState.IDLE,
      },
      {
        serialNumber: 'DRN-0002',
        model: DroneModel.MIDDLEWEIGHT,
        weightLimit: droneCapacity(DroneModel.MIDDLEWEIGHT),
        battery: 87,
        // state: DroneState.IDLE,
      },
      {
        serialNumber: 'DRN-0003',
        model: DroneModel.CRUISERWEIGHT,
        weightLimit: droneCapacity(DroneModel.CRUISERWEIGHT),
        battery: 92,
        // state: DroneState.IDLE,
      },
      {
        serialNumber: 'DRN-0004',
        model: DroneModel.HEAVYWEIGHT,
        weightLimit: droneCapacity(DroneModel.HEAVYWEIGHT),
        battery: 76,
        // state: DroneState.IDLE,
      },
      {
        serialNumber: 'DRN-0005',
        model: DroneModel.LIGHTWEIGHT,
        weightLimit: droneCapacity(DroneModel.LIGHTWEIGHT),
        battery: 68,
        // state: DroneState.IDLE,
      },
      {
        serialNumber: 'DRN-0006',
        model: DroneModel.MIDDLEWEIGHT,
        weightLimit: droneCapacity(DroneModel.MIDDLEWEIGHT),
        battery: 81,
        // state: DroneState.IDLE,
      },
      {
        serialNumber: 'DRN-0007',
        model: DroneModel.CRUISERWEIGHT,
        weightLimit: droneCapacity(DroneModel.CRUISERWEIGHT),
        battery: 54,
        // state: DroneState.IDLE,
      },
      {
        serialNumber: 'DRN-0008',
        model: DroneModel.HEAVYWEIGHT,
        weightLimit: droneCapacity(DroneModel.HEAVYWEIGHT),
        battery: 63,
        // state: DroneState.IDLE,
      },
      {
        serialNumber: 'DRN-0009',
        model: DroneModel.LIGHTWEIGHT,
        weightLimit: droneCapacity(DroneModel.LIGHTWEIGHT),
        battery: 49,
        // state: DroneState.IDLE,
      },
      {
        serialNumber: 'DRN-0010',
        model: DroneModel.MIDDLEWEIGHT,
        weightLimit: droneCapacity(DroneModel.MIDDLEWEIGHT),
        battery: 95,
        // state: DroneState.IDLE,
      },
    ];

    const operations = droneSeeds.map((seed) => ({
      updateOne: {
        filter: { serialNumber: seed.serialNumber },
        update: { $set: seed },
        upsert: true,
      },
    }));

    const result = await this.droneModel.bulkWrite(operations, { ordered: false });
    this.logger.debug(
      `Drone seed upserted: ${result.upsertedCount ?? 0}, modified: ${
        result.modifiedCount ?? 0
      }`,
    );
  }

  private async seedMedications() {
    const medicationSeeds: Medication[] = [
      {
        name: 'PainRelief_10',
        weight: 10,
        code: 'MED_PR10',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8u735El8xwyLJsINcwSg0uzCIRpWyJulw0w&s',
      },
      {
        name: 'HealQuick_15',
        weight: 15,
        code: 'MED_HQ15',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqDVXqKlsDA65rLm5IcB8Zc-XhDUrpVlnLW2hue2OQ5D0nYPkzMThLt98PwRDMg6yBoUQ&usqp=CAU',
      },
      {
        name: 'CalmDose_20',
        weight: 20,
        code: 'MED_CD20',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-7BKdLpw0DHQOyqtsNTbndc01wzScQYjkwQ&s',
      },
    ];

    const operations = medicationSeeds.map((seed) => ({
      updateOne: {
        filter: { code: seed.code },
        update: { $set: seed },
        upsert: true,
      },
    }));

    const result = await this.medicationModel.bulkWrite(operations, { ordered: false });
    this.logger.debug(
      `Medication seed upserted: ${result.upsertedCount ?? 0}, modified: ${
        result.modifiedCount ?? 0
      }`,
    );
  }
}
