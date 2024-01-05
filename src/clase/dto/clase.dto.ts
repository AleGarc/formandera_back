import { Turno } from '../entities/clase.entity';

export class ClaseDto {
  idPublico?: string;
  nombre: string;
  descripcion: string;
  precio?: number;
  idProfesor: string;
  asignaturas: string[];
  turnos: Turno[];

  constructor({
    idPublico,
    nombre,
    descripcion,
    precio,
    idProfesor,
    asignaturas,
    turnos,
  }: {
    idPublico?: string;
    nombre: string;
    descripcion: string;
    precio?: number;
    idProfesor: string;
    asignaturas: string[];
    turnos: Turno[];
  }) {
    this.idPublico = idPublico;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.idProfesor = idProfesor;
    this.asignaturas = asignaturas;
    this.turnos = turnos;
  }
}

export class TurnoDto {
  idPublico: string;
  dia: string;
  asignatura: string;
  horaInicio: string;
  horaFin: string;
  alumnosMax: number;
  idAlumnos: string[];

  constructor({
    idPublico,
    dia,
    asignatura,
    horaInicio,
    horaFin,
    alumnosMax,
    idAlumnos,
  }: {
    idPublico: string;
    dia: string;
    asignatura: string;
    horaInicio: string;
    horaFin: string;
    alumnosMax: number;
    idAlumnos: string[];
  }) {
    this.idPublico = idPublico;
    this.dia = dia;
    this.asignatura = asignatura;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    this.alumnosMax = alumnosMax;
    this.idAlumnos = idAlumnos;
  }
}
