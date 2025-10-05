import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { DroneModel } from '../enums/drone-model.enum';

export class GetAllDronesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Model classification of the drone',
    enum: DroneModel,
    example: null,
  })
  @IsOptional()
  @IsEnum(DroneModel)
  model?: DroneModel;
}