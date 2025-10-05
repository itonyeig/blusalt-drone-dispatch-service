import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';
import { DroneModel } from '../enums/drone-model.enum';
import { DroneState } from '../enums/drone-state.enum';

export class CreateDroneDto {

  @ApiProperty({
    description: 'Model classification of the drone',
    enum: DroneModel,
    example: DroneModel.LIGHTWEIGHT,
  })
  @IsEnum(DroneModel)
  model: DroneModel;
}
