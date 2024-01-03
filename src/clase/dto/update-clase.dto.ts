import { PartialType } from '@nestjs/mapped-types';
import { CreateClaseDto } from './create-clase.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateClaseDto extends PartialType(CreateClaseDto) {
  @IsNotEmpty()
  @IsString()
  readonly idPublico: string;
}
