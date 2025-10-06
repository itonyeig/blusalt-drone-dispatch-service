import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsInt, IsMongoId, IsOptional, Min, ValidateNested } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DroneModel } from 'src/drone/enums/drone-model.enum';

export class LoadDroneItemDto {
  @ApiProperty({
    description: 'Medication identifier to load onto the drone',
    example: '60f7f4b2183b2c6d88a5ba14',
  })
  @IsMongoId()
  medication: string;

  @ApiProperty({
    description: 'Quantity of the medication to load',
    example: 2,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

export class LoadDroneDto {
  @ApiProperty({
    description: 'List of medication items to load onto the drone',
    type: [LoadDroneItemDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => LoadDroneItemDto)
  items: LoadDroneItemDto[];
}

export class AvailableDronesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Model classification of the drone',
    enum: DroneModel,
    example: null,
  })
  @IsOptional()
  @IsEnum(DroneModel)
  model?: DroneModel;
}
