import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Min, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    example: '1',
    required: false,
    description: 'Page number (starts from 1)',
  })
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'The number of riders to retrieve per page.',
    example: 10,
    required: false,
  })
  limit?: number = 10;

}


