import { Metadatos } from 'src/base/metadatos';

export class Clase {
  _idDB: string;
  idPublico: string;
  nombre: string;
  descripcion: string;
  idProfesor: string;
  asignaturas: string[];
  turnos: Turno[];
  //ubicación: string;
  metadatos: Metadatos;

  constructor({
    _idDB,
    idPublico,
    nombre,
    descripcion,
    idProfesor,
    asignaturas,
    turnos,
    metadatos,
  }: {
    _idDB?: string;
    idPublico?: string;
    nombre: string;
    descripcion: string;
    idProfesor: string;
    asignaturas: string[];
    turnos: Turno[];
    metadatos: Metadatos;
  }) {
    this._idDB = _idDB;
    this.idPublico = idPublico;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.idProfesor = idProfesor;
    this.asignaturas = asignaturas;
    this.turnos = turnos;
    this.metadatos = metadatos;
  }
}

export class Turno {
  day: string;
  asignatura: string;
  horaInicio: string;
  horaFin: string;
  alumnosMax: number;
  idAlumnos: string[] = [];
}
