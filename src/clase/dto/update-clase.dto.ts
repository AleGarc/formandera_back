import { PartialType } from '@nestjs/mapped-types';
import { CreateClaseDto, CreateTurnoDto } from './create-clase.dto';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateClaseDto extends PartialType(CreateClaseDto) {}

export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {
  @IsNotEmpty()
  @IsString()
  readonly idPublico: string;

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  readonly idAlumnos: string[];
}
