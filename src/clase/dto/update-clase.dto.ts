import { PartialType } from '@nestjs/mapped-types';
import { CreateClaseDto, CreateTurnoDto } from './create-clase.dto';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateClaseDto extends PartialType(CreateClaseDto) {
  @IsOptional()
  @IsNotEmpty()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateTurnoDto)
  turnos: CreateTurnoDto[];
}

export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  readonly idAlumnos: string[];
}
