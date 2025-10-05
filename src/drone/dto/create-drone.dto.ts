import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { DroneModel } from '../../drone/enums/drone-model.enum';

export class CreateDroneDto {

  @ApiProperty({
    description: 'Model classification of the drone',
    enum: DroneModel,
    example: DroneModel.LIGHTWEIGHT,
  })
  @IsEnum(DroneModel)
  model: DroneModel;
}
