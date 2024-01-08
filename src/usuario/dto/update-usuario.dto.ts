import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly biografia: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly clase: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString({ each: true })
  readonly asignaturas: string[];

  @IsOptional()
  @IsNotEmpty()
  @IsString({ each: true })
  readonly experiencia: string[];

  @IsOptional()
  @IsNotEmpty()
  @IsString({ each: true })
  readonly educacion: string[];
}
