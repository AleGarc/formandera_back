import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateComentarioDto {
  @IsNotEmpty()
  @IsString()
  idAutor: string;

  @IsNotEmpty()
  @IsString()
  nombreAutor: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  calificacion: number;

  @IsNotEmpty()
  @IsString()
  mensaje: string;
}
