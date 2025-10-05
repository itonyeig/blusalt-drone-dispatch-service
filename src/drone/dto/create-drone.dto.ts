import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { DroneModel } from '../enums/drone-model.enum';

export class CreateDroneDto {
  @ApiProperty({
    description: 'Model classification of the drone',
    enum: DroneModel,
    example: DroneModel.LIGHTWEIGHT,
  })
  @IsEnum(DroneModel)
  model: DroneModel;

  @ApiPropertyOptional({
    description: 'Unique serial number used to identify the drone',
    example: 'DRN-0001',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  serialNumber?: string;

  // @ApiPropertyOptional({
  //   description: 'Maximum payload weight the drone can carry in grams',
  //   example: 450,
  //   minimum: 0,
  //   maximum: 500,
  // })
  // @IsOptional()
  // @Type(() => Number)
  // @IsNumber()
  // @Min(0)
  // @Max(500)
  // weightLimit?: number;

  @ApiPropertyOptional({
    description: 'Current battery level percentage of the drone',
    example: 75,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  battery?: number;

}
