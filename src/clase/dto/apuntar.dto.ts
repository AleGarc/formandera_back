import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ApuntarDto {
  @IsNotEmpty()
  @IsString()
  idTurno: string;

  @IsNotEmpty()
  @IsString()
  idAlumno: string;

  @IsNotEmpty()
  @IsBoolean()
  apuntarse: boolean;
}
