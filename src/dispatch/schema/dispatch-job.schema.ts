import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Drone } from '../../drone/schemas/drone.schema';
import { Medication } from '../../medication/schema/medication.schema';

@Schema()
export class DispatchJob {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Drone.name, required: true })
  drone: Types.ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: Medication.name, required: true })
  medications: Types.ObjectId[];

}

export type DispatchJobDocument = DispatchJob & Document<Types.ObjectId>;

export const DispatchJobSchema = SchemaFactory.createForClass(DispatchJob);
