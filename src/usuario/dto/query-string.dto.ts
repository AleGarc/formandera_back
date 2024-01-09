import {
  IsString,
  Min,
  IsOptional,
  IsNotEmpty,
  ArrayNotEmpty,
  ArrayMinSize,
  IsArray,
  Max,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryStringDto {
  @IsOptional()
  @IsString()
  keyword: string;

  @IsOptional()
  @IsString()
  tipo: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  asignaturas: string[];

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  @Transform(({ value }) => Number(value))
  take: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  skip: number;
}
