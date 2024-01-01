import { Turno } from '../entities/clase.entity';

export class GetClaseDto {
  idPublico?: string;
  nombre: string;
  descripcion: string;
  idProfesor: string;
  asignaturas: string[];
  turnos: Turno[];

  constructor({
    idPublico,
    nombre,
    descripcion,
    idProfesor,
    asignaturas,
    turnos,
  }: {
    idPublico?: string;
    nombre: string;
    descripcion: string;
    idProfesor: string;
    asignaturas: string[];
    turnos: Turno[];
  }) {
    this.idPublico = idPublico;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.idProfesor = idProfesor;
    this.asignaturas = asignaturas;
    this.turnos = turnos;
  }
}
