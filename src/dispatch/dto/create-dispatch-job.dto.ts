import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { DroneState } from '../../drone/enums/drone-state.enum';

export class CreateDispatchJobDto {
  @ApiProperty({
    description: 'Identifier of the drone that will execute the dispatch',
    example: '60f7f4a9183b2c6d88a5ba10',
  })
  @IsMongoId()
  drone!: string;

  @ApiProperty({
    description: 'Identifiers of medications to load on the drone',
    example: ['60f7f4b2183b2c6d88a5ba14'],
    isArray: true,
    type: String,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  medications!: string[];

  @ApiProperty({
    description: 'State transition starting point for the dispatch',
    enum: DroneState,
    example: DroneState.LOADING,
  })
  @IsEnum(DroneState)
  fromState!: DroneState;

  @ApiProperty({
    description: 'State transition destination for the dispatch',
    enum: DroneState,
    example: DroneState.LOADED,
  })
  @IsEnum(DroneState)
  toState!: DroneState;

  @ApiProperty({
    description: 'Optional timestamp for when the dispatch occurs',
    example: '2025-01-05T12:34:56.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  timestamp?: string;
}
