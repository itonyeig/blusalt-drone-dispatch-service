import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Medication {
  @Prop({ required: true, trim: true, match: /^[A-Za-z0-9_-]+$/ })
  name: string;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: true, trim: true, uppercase: true, match: /^[A-Z0-9_]+$/ })
  code: string;

  @Prop({ required: true })
  image: string;
}

export type MedicationDocument = Medication & Document<Types.ObjectId>;

export const MedicationSchema = SchemaFactory.createForClass(Medication);
