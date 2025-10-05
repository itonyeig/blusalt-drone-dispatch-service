import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { DroneModel } from '../enums/drone-model.enum';
import { DroneState } from '../enums/drone-state.enum';

@Schema()
export class Drone {
  @Prop({ required: true, trim: true, maxlength: 100, unique: true })
  serialNumber: string;

  @Prop({ required: true, enum: DroneModel })
  model: DroneModel;

  @Prop({ required: true, max: 500 })
  weightLimit: number;

  @Prop({ required: true, min: 0, max: 100, default: 100 })
  battery: number;

  @Prop({ required: true, enum: DroneState, default: DroneState.IDLE })
  state: DroneState;
}

export type DroneDocument = Drone & Document<Types.ObjectId>;

export const DroneSchema = SchemaFactory.createForClass(Drone);
