// utils/paginate.ts
import { FilterQuery, Model, ProjectionType, PopulateOptions } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export interface PaginateOptions<T> {
  // page?: number;          // 1-based
  // limit?: number;         // items per page
  sort?: Record<string, 1 | -1>;
  select?: ProjectionType<T>;
  populate?: PopulateOptions | PopulateOptions[];
  lean?: boolean;         // default true
  maxLimit?: number;      // hard cap to prevent huge queries
  map?: (doc: any) => T;
}

export interface PaginatedResult<T> {
  content: T[];
  total: number;
  pageSize: number;
  // limit: number;
  // pages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage?: number;
  previousPage?: number;
  currentPage: number;
  totalPages: number;
}

export async function paginate<MDoc>(
  model: Model<MDoc>,
  filter: FilterQuery<MDoc>,
  paginationDto: PaginationDto = { page: 1, limit: 10 },
  {
    sort = { createdAt: -1 },
    select,
    populate,
    lean = true,
    maxLimit,
    // maxLimit = 100,
  }: PaginateOptions<MDoc> = {},
): Promise<PaginatedResult<any>> {
  const { page = 1, limit = 10 } = paginationDto;
  const safeLimit = maxLimit ? Math.min(Math.max(1, limit), maxLimit) : limit;
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * safeLimit;

  const findQuery = model.find(filter, select).sort(sort).skip(skip).limit(safeLimit);
  if (populate) findQuery.populate(populate as any);
  if (lean) findQuery.lean();

  const [content, total] = await Promise.all([
    findQuery.exec(),
    model.countDocuments(filter).exec(),
  ]);

  const pages = Math.max(1, Math.ceil(total / safeLimit));
  const hasPrev = safePage > 1;
  const hasNext = safePage < pages;

  return {
  content,
  previousPage: page > 1 ? page - 1 : undefined,
  nextPage: page < pages ? page + 1 : undefined,
  hasPrev,
  hasNext,
  total,
  pageSize: content.length,
  currentPage: safePage,
  totalPages: pages,
};
}
