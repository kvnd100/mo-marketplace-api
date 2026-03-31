import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({ example: 'Red' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: 'M' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ example: 'Cotton' })
  @IsString()
  @IsNotEmpty()
  material: string;

  @ApiProperty({ example: 34.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ example: 100, default: 0 })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: 'TSH-RED-M-COT' })
  @IsOptional()
  @IsString()
  sku?: string;
}
