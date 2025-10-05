import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MedicationService } from './medication.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { ResponseFormatter } from 'src/common/response-formatter';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('medication')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new medication' })
  async create(@Body() createMedicationDto: CreateMedicationDto) {
    const data = await this.medicationService.create(createMedicationDto);
    return ResponseFormatter.Ok({ data });
  }

  @Get()
  @ApiOperation({ summary: 'Get all medications' })
  async getAll(@Query() paginationDto: PaginationDto) {
    const data = await this.medicationService.getMedications(paginationDto);
    return ResponseFormatter.Ok({ data });
  }
}
