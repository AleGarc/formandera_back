import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateClaseDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsString()
  ubicacion: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  precio: number;

  @IsNotEmpty()
  @IsString()
  idProfesor: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  asignaturas: string[];
}

export class CreateTurnoDto {
  @IsNotEmpty()
  @IsString()
  dia: string;

  @IsNotEmpty()
  @IsString()
  asignatura: string;

  @IsNotEmpty()
  @IsString()
  horaInicio: string;

  @IsNotEmpty()
  @IsString()
  horaFin: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(30)
  alumnosMax: number;
}
