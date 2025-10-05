import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medication, MedicationDocument } from './schema/medication.schema';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { paginate } from 'src/utils/pagination.helper';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MedicationService {
  constructor(
    @InjectModel(Medication.name)
    private medicationModel: Model<MedicationDocument>,
  ) {}

  async create(dto: CreateMedicationDto) {
    const medicationData: Medication = {
      name: dto.name,
      weight: dto.weight,
      code: dto.code,
      image: dto.image,
    };
    const medication = await this.medicationModel.create(medicationData);
    return medication;
  }

  async getMedications(paginationDto: PaginationDto) {

    const medications = await paginate(this.medicationModel, {}, paginationDto);
    return medications;
  }
}
