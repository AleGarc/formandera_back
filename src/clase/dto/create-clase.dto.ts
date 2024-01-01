import { Turno } from '../entities/clase.entity';

export class CreateClaseDto {
  nombre: string;
  descripcion: string;
  idProfesor: string;
  asignaturas: string[];
  turnos: Turno[];
}
