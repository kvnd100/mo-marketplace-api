import {
  IsOptional,
  IsInt,
  IsNumber,
  IsString,
  IsIn,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

const ToArray = () =>
  Transform(
    ({
      value,
    }: {
      value: string | string[] | undefined | null;
    }): string[] | undefined => {
      if (value === undefined || value === null) return undefined;
      return Array.isArray(value) ? value : [value];
    },
  );

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ example: ['Electronics'], type: [String] })
  @IsOptional()
  @ToArray()
  @IsArray()
  @IsString({ each: true })
  category?: string[];

  @ApiPropertyOptional({ example: ['Apple'], type: [String] })
  @IsOptional()
  @ToArray()
  @IsArray()
  @IsString({ each: true })
  brand?: string[];

  @ApiPropertyOptional({ example: ['new'], type: [String] })
  @IsOptional()
  @ToArray()
  @IsArray()
  @IsString({ each: true })
  condition?: string[];

  @ApiPropertyOptional({ example: 3.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter to in-stock items only',
  })
  @IsOptional()
  @IsString()
  stock?: string;

  @ApiPropertyOptional({
    example: 'price_asc',
    enum: ['price_asc', 'price_desc', 'rating_desc', 'newest', 'oldest'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['price_asc', 'price_desc', 'rating_desc', 'newest', 'oldest'])
  sort?: string;
}
