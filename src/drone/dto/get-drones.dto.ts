import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateDroneDto } from './create-drone.dto';

export class GetAllDronesDto extends PartialType(
  IntersectionType(PaginationDto, CreateDroneDto),
) {}