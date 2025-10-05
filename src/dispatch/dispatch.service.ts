import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { Drone, DroneDocument } from '../drone/schemas/drone.schema';
import { Medication, MedicationDocument } from '../medication/schema/medication.schema';
import {
  DispatchJob,
  DispatchJobDocument,
  DispatchJobStatus,
} from './schema/dispatch-job.schema';
import { LoadDroneDto } from './dto/load-drone.dto';
import { MIN_BATTERY_TO_LOAD, DISPATCH_STATE_DELAY_MS } from './constants/dispatch.constants';
import { DroneState } from '../drone/enums/drone-state.enum';
import { delay } from '../utils/helper.utils';

@Injectable()
export class DispatchService {
  private readonly logger = new Logger(DispatchService.name);

  constructor(
    @InjectModel(DispatchJob.name)
    private readonly dispatchJobModel: Model<DispatchJobDocument>,
    @InjectModel(Drone.name)
    private readonly droneModel: Model<DroneDocument>,
    @InjectModel(Medication.name)
    private readonly medicationModel: Model<MedicationDocument>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async loadDrone(drone: Drone & { _id: Types.ObjectId }, dto: LoadDroneDto): Promise<{ jobId: string }> {
    if (!dto.items?.length) {
      throw new BadRequestException('At least one medication item must be provided.');
    }

    const session = await this.connection.startSession();
    let jobId: string | null = null;
    const startTime = Date.now();

    try {
      await session.withTransaction(async () => {
        const medicationDocs = await this.assertMedicationsExistAndGet(dto.items, session);
        const medicationMap = new Map(
          medicationDocs.map((doc) => [doc._id.toString(), doc]),
        );

        const totalWeight = this.computeTotalWeight(dto.items, medicationMap);

        if (totalWeight > drone.weightLimit) {
          throw new ConflictException('Requested items exceed drone weight limit.');
        }

        const claimedDrone = await this.droneModel.findOneAndUpdate(
          {
            _id: drone._id,
            state: DroneState.IDLE,
            battery: { $gte: MIN_BATTERY_TO_LOAD },
          },
          { $set: { state: DroneState.LOADING } },
          { new: true, session },
        );

        if (!claimedDrone) {
          throw new ConflictException('Drone is no longer available for loading.');
        }

        this.logger.debug(`[Dispatch] Drone ${claimedDrone.id} ? ${DroneState.LOADING}`);
        await delay(DISPATCH_STATE_DELAY_MS);

        await this.transitionDrone(claimedDrone._id, DroneState.LOADED, session);
        const dispatchJob = await this.createDispatchJob(
          claimedDrone._id,
          dto.items,
          medicationMap,
          totalWeight,
          session,
        );
        jobId = dispatchJob.id;

        await delay(DISPATCH_STATE_DELAY_MS);

        await this.transitionDrone(claimedDrone._id, DroneState.DELIVERING, session);
        await this.updateJobStatus(dispatchJob._id, DispatchJobStatus.IN_PROGRESS, session);

        await delay(DISPATCH_STATE_DELAY_MS);

        await this.transitionDrone(claimedDrone._id, DroneState.DELIVERED, session);
        await this.updateJobStatus(
          dispatchJob._id,
          DispatchJobStatus.DELIVERED,
          session,
          { droppedOffOn: new Date() },
        );

        await delay(DISPATCH_STATE_DELAY_MS);

        await this.transitionDrone(claimedDrone._id, DroneState.RETURNING, session);
        await this.updateJobStatus(dispatchJob._id, DispatchJobStatus.RETURNED, session);

        await delay(DISPATCH_STATE_DELAY_MS);

        await this.transitionDrone(claimedDrone._id, DroneState.IDLE, session);
      });

      const totalMs = Date.now() - startTime;
      this.logger.debug(
        `[Dispatch] Drone ${drone._id} cycle completed in ${(totalMs / 1000).toFixed(1)}s`,
      );
    } finally {
      await session.endSession();
    }

    if (!jobId) {
      throw new ConflictException('Failed to create dispatch job.');
    }

    return { jobId };
  }

  async getLoadedItems(droneId: string) {
    const job = await this.dispatchJobModel
      .findOne({ drone: new Types.ObjectId(droneId) })
      .sort({ loadedOn: -1 })
      .lean();

    if (!job) {
      return [];
    }

    return job.items.map((item) => ({
      medication: item.medication,
      quantity: item.quantity,
      unitWeight: item.unitWeight,
    }));
  }

  async getAvailableDrones() {
    return this.droneModel
      .find({ state: DroneState.IDLE, battery: { $gte: MIN_BATTERY_TO_LOAD } })
      .lean();
  }

  // async getBatteryLevel(droneId: string) {
  //   const droneDoc = await this.droneModel.findById(droneId).lean();
  //   if (!droneDoc) {
  //     throw new NotFoundException(`Drone with id ${droneId} not found`);
  //   }
  //   return { battery: droneDoc.battery };
  // }

  private async assertMedicationsExistAndGet(
    items: LoadDroneDto['items'],
    session: ClientSession,
  ): Promise<MedicationDocument[]> {
    const medicationIds = [...new Set(items.map((item) => item.medication))].map(
      (id) => new Types.ObjectId(id),
    );

    const medications = await this.medicationModel
      .find({ _id: { $in: medicationIds } })
      .session(session);

    if (medications.length !== medicationIds.length) {
      throw new NotFoundException('One or more medications could not be found.');
    }

    return medications;
  }

  private computeTotalWeight(
    items: LoadDroneDto['items'],
    medsById: Map<string, MedicationDocument>,
  ) {
    return items.reduce((total, item) => {
      const medication = medsById.get(item.medication);
      if (!medication) {
        throw new NotFoundException(`Medication ${item.medication} not found.`);
      }
      return total + medication.weight * item.quantity;
    }, 0);
  }

  private async createDispatchJob(
    droneId: Types.ObjectId,
    items: LoadDroneDto['items'],
    medsById: Map<string, MedicationDocument>,
    totalWeight: number,
    session: ClientSession,
  ) {
    const preparedItems = items.map((item) => {
      const med = medsById.get(item.medication);
      if (!med) {
        throw new NotFoundException(`Medication ${item.medication} not found.`);
      }

      return {
        medication: new Types.ObjectId(item.medication),
        quantity: item.quantity,
        unitWeight: med.weight,
      };
    });

    const jobData: DispatchJob = {
      drone: droneId,
      items: preparedItems,
      totalWeight,
      loadedOn: new Date(),
      status: DispatchJobStatus.ASSIGNED,
    };
    const [job] = await this.dispatchJobModel.create(
      [jobData],
      { session },
    );

    this.logger.debug(`[Dispatch] Job ${job.id} created for drone ${droneId.toString()}`);
    return job;
  }

  private async transitionDrone(
    droneId: Types.ObjectId,
    nextState: DroneState,
    session: ClientSession,
  ) {
    const updated = await this.droneModel
      .findByIdAndUpdate(droneId, { $set: { state: nextState } }, { new: true, session })
      .lean();

    if (!updated) {
      throw new ConflictException(`Unable to transition drone ${droneId.toString()} state.`);
    }

    this.logger.debug(`[Dispatch] Drone ${droneId.toString()} ? ${nextState}`);
  }

  private async updateJobStatus(
    jobId: Types.ObjectId,
    status: DispatchJobStatus,
    session: ClientSession,
    extra: Partial<DispatchJob> = {},
  ) {
    const update: Partial<DispatchJob> & { status: DispatchJobStatus } = {
      status,
      ...extra,
    };

    const updated = await this.dispatchJobModel
      .findByIdAndUpdate(jobId, { $set: update }, { new: true, session })
      .lean();

    if (!updated) {
      throw new ConflictException(`Failed to update dispatch job ${jobId.toString()}.`);
    }

    this.logger.debug(`[Dispatch] Job ${jobId.toString()} ? ${status}`);
    return updated;
  }
}
