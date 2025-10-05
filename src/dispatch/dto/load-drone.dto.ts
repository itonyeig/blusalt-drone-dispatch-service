import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsMongoId, Min, ValidateNested } from 'class-validator';

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
