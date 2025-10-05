import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl, Matches, Max, Min } from 'class-validator';

export class CreateMedicationDto {
  @ApiProperty({
    description: 'Medication name allowing letters, numbers, hyphen, and underscore characters',
    example: 'PainRelief_25',
    pattern: '^[A-Za-z0-9_-]+$',
  })
  @IsString()
  @Matches(/^[A-Za-z0-9_-]+$/)
  name: string;

  @ApiProperty({
    description: 'Weight of the medication in grams',
    example: 125,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  weight: number;

  @ApiProperty({
    description: 'Uppercase code identifying the medication',
    example: 'MED_001',
    pattern: '^[A-Z0-9_]+$',
  })
  @IsString()
  @Matches(/^[A-Z0-9_]+$/)
  code: string;

  @ApiProperty({
    description: 'Image representing the medication. Accepts URL',
    example: 'https://cdn.example.com/medications/med_001.png',
  })
  @IsUrl()
  image: string;
}
