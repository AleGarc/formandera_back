import {
  ErrorFormanderaBadRequest,
  ErrorFormanderaNotFound,
} from 'src/base/error';
import { Metadatos } from 'src/base/metadatos';

export class Clase {
  _idDB: string;
  idPublico: string;
  nombre: string;
  descripcion: string;
  precio?: number;
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
    precio,
    idProfesor,
    asignaturas,
    turnos,
    metadatos,
  }: {
    _idDB?: string;
    idPublico?: string;
    nombre: string;
    descripcion: string;
    precio?: number;
    idProfesor: string;
    asignaturas: string[];
    turnos: Turno[];
    metadatos: Metadatos;
  }) {
    this._idDB = _idDB;
    this.idPublico = idPublico;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.idProfesor = idProfesor;
    this.asignaturas = asignaturas;
    this.turnos = turnos;
    this.metadatos = metadatos;
  }

  modificarClase(clase: Clase) {
    this.nombre = clase.nombre;
    this.descripcion = clase.descripcion;
    this.precio = clase.precio;
    this.asignaturas = clase.asignaturas;
    this.metadatos.updatedAt = new Date().toISOString();
    this.metadatos.updatedBy = this.metadatos.createdBy;
  }

  apuntarAlumno(idTurno: string, idAlumno: string, apuntarse: boolean) {
    const turno = this.turnos.find((turno) => turno.idPublico === idTurno);

    if (!turno) {
      throw new ErrorFormanderaNotFound('No se ha encontrado el turno');
    }
    if (turno.idAlumnos.length >= turno.alumnosMax) {
      throw new ErrorFormanderaBadRequest('El turno está completo');
    }
    if (apuntarse && turno.idAlumnos.includes(idAlumno)) {
      throw new ErrorFormanderaBadRequest(
        `El alumno con id ${idAlumno} ya está apuntado al turno`,
      );
    }
    if (!apuntarse && !turno.idAlumnos.includes(idAlumno)) {
      throw new ErrorFormanderaBadRequest(
        `El alumno con id ${idAlumno} no está apuntado al turno`,
      );
    } else {
      if (apuntarse) turno.idAlumnos.push(idAlumno);
      else turno.idAlumnos = turno.idAlumnos.filter((id) => id !== idAlumno);
    }
  }

  private checkOtrosTurnos(turno: Turno) {
    this.turnos.forEach((turnoClase) => {
      if (turnoClase.dia === turno.dia) {
        if (
          (turno.horaInicio > turnoClase.horaInicio &&
            turno.horaInicio < turnoClase.horaFin) ||
          (turno.horaFin > turnoClase.horaInicio &&
            turno.horaFin < turnoClase.horaFin)
        ) {
          throw new ErrorFormanderaBadRequest(
            'El turno se solapa con otro turno de la clase.',
          );
        }
      }
    });
  }

  private checkHoras(turno: Turno) {
    const fecha1: Date = new Date(`2000-01-01T${turno.horaInicio}`);
    const fecha2: Date = new Date(`2000-01-01T${turno.horaFin}`);

    const diferenciaEnMs = Math.abs(fecha2.getTime() - fecha1.getTime());
    const diferenciaEnMinutos = diferenciaEnMs / (1000 * 60);

    if (fecha2 <= fecha1) {
      throw new ErrorFormanderaBadRequest(
        'La segunda hora debe ser posterior a la primera.',
      );
    }

    if (diferenciaEnMinutos < 30) {
      throw new ErrorFormanderaBadRequest(
        'La diferencia entre las horas debe ser de al menos 30 minutos.',
      );
    }
  }

  cambiarTurno(turno: Turno) {
    const turnoIndex = this.turnos.findIndex(
      (turno) => turno.idPublico === turno.idPublico,
    );
    if (turnoIndex === -1) {
      throw new ErrorFormanderaNotFound('No se ha encontrado el turno');
    }
    const turnoActual = this.turnos[turnoIndex];
    const turnoActualizado = new Turno({
      idPublico: turno.idPublico ?? turnoActual.idPublico,
      dia: turno.dia ?? turnoActual.dia,
      asignatura: turno.asignatura ?? turnoActual.asignatura,
      horaInicio: turno.horaInicio ?? turnoActual.horaInicio,
      horaFin: turno.horaFin ?? turnoActual.horaFin,
      alumnosMax: turno.alumnosMax ?? turnoActual.alumnosMax,
      idAlumnos: turno.idAlumnos ?? turnoActual.idAlumnos,
    });

    this.checkHoras(turnoActualizado);
    this.checkOtrosTurnos(turnoActualizado);
    this.turnos[turnoIndex] = turnoActualizado;

    this.metadatos.updatedAt = new Date().toISOString();
    this.metadatos.updatedBy = this.metadatos.updatedBy;
  }

  nuevoTurno(turno: Turno) {
    this.checkHoras(turno);
    this.checkOtrosTurnos(turno);
    this.turnos.push(turno);

    this.metadatos.updatedAt = new Date().toISOString();
    this.metadatos.updatedBy = this.metadatos.updatedBy;
  }

  borrarTurno(idTurno: string) {
    const turnoIndex = this.turnos.findIndex(
      (turno) => turno.idPublico === idTurno,
    );
    if (turnoIndex === -1) {
      throw new ErrorFormanderaNotFound('No se ha encontrado el turno');
    }
    this.turnos.splice(turnoIndex, 1);

    this.metadatos.updatedAt = new Date().toISOString();
    this.metadatos.updatedBy = this.metadatos.updatedBy;
  }
}

export class Turno {
  idPublico: string;
  dia: string;
  asignatura: string;
  horaInicio: string;
  horaFin: string;
  alumnosMax: number;
  idAlumnos: string[] = [];

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
    idAlumnos?: string[];
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
