import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly biografia: string;
}
