import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Drone } from './drone.schema';

export class AuditBattery {
  @Prop({ type: Types.ObjectId, ref: Drone.name, required: true })
  drone: Types.ObjectId;

  @Prop({ type: Number, min: 0, max: 100, required: true })
  battery: number;
}

export type AuditBatteryDocument = AuditBattery & Document<Types.ObjectId>;

export const AuditBatterySchema = SchemaFactory.createForClass(AuditBattery);

