import { PartialType } from '@nestjs/mapped-types';
import { CreateComentarioDto } from './create-valoracion.dto';

export class UpdateComentarioDto extends PartialType(CreateComentarioDto) {}
