import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Drone } from '../../drone/schemas/drone.schema';
import { Medication } from '../../medication/schema/medication.schema';

export enum DispatchJobStatus {
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
}

@Schema({ _id: false })
export class DispatchItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Medication.name, required: true })
  medication!: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1 })
  quantity!: number;

  @Prop({ type: Number, required: true, min: 0 })
  unitWeight!: number;
}

const DispatchItemSchema = SchemaFactory.createForClass(DispatchItem);

@Schema()
export class DispatchJob {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Drone.name, required: true })
  drone: Types.ObjectId;

  @Prop({ type: [DispatchItemSchema], required: true })
  items: DispatchItem[];

  @Prop({ type: Number, required: true, min: 0 })
  totalWeight!: number;

  @Prop({ type: Date, required: true })
  loadedOn!: Date;

  @Prop({ type: Date })
  droppedOffOn?: Date;

  @Prop({ type: String, enum: DispatchJobStatus, default: DispatchJobStatus.ASSIGNED })
  status!: DispatchJobStatus;
}

export type DispatchJobDocument = DispatchJob & Document<Types.ObjectId>;

export const DispatchJobSchema = SchemaFactory.createForClass(DispatchJob);
