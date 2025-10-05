import { Module } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { MedicationController } from './medication.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Medication, MedicationSchema } from './schema/medication.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medication.name, schema: MedicationSchema },
    ]),
  ],
  controllers: [MedicationController],
  providers: [MedicationService],
})
export class MedicationModule {}
