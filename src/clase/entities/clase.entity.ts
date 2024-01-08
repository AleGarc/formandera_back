import {
  ErrorFormanderaBadRequest,
  ErrorFormanderaNotFound,
} from 'src/base/error';
import { Metadatos } from 'src/base/metadatos';

export class Clase {
  _idDB?: string;
  idPublico?: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  precio?: number;
  idProfesor: string;
  asignaturas: string[];
  turnos: Turno[];
  metadatos: Metadatos;

  constructor({
    _idDB,
    idPublico,
    nombre,
    descripcion,
    ubicacion,
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
    ubicacion: string;
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
    this.ubicacion = ubicacion;
    this.precio = precio;
    this.idProfesor = idProfesor;
    this.asignaturas = asignaturas;
    this.turnos = turnos;
    this.metadatos = metadatos;
  }

  modificarClase(clase: Clase) {
    this.nombre = clase.nombre;
    this.descripcion = clase.descripcion;
    this.ubicacion = clase.ubicacion;
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
    if (apuntarse && turno.idAlumnos.length >= turno.alumnosMax) {
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
          (turno.idPublico !== turnoClase.idPublico &&
            turno.horaInicio > turnoClase.horaInicio &&
            turno.horaInicio < turnoClase.horaFin) ||
          (turno.idPublico !== turnoClase.idPublico &&
            turno.horaFin > turnoClase.horaInicio &&
            turno.horaFin < turnoClase.horaFin) ||
          (turno.idPublico !== turnoClase.idPublico &&
            turno.horaInicio === turnoClase.horaInicio &&
            turno.horaFin === turnoClase.horaFin)
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

  private actualizarYOrdenarTurnos(turnoActualizado: Turno) {
    const turnoIndex = this.turnos.findIndex(
      (turno) => turno.idPublico === turnoActualizado.idPublico,
    );

    if (turnoIndex !== -1) {
      // Actualiza el turno existente
      this.turnos[turnoIndex] = turnoActualizado;

      // Crea una copia del array de turnos
      const nuevosTurnos = [...this.turnos];

      // Ordena el array según el día y la hora de inicio
      nuevosTurnos.sort((a, b) => {
        if (a.dia !== b.dia) {
          return a.dia.localeCompare(b.dia);
        } else {
          return a.horaInicio.localeCompare(b.horaInicio);
        }
      });

      this.turnos = nuevosTurnos;
    } else {
      throw new ErrorFormanderaNotFound('No se ha encontrado el turno');
    }
  }

  cambiarTurno(turno: Turno) {
    const turnoIndex = this.turnos.findIndex(
      (turnoClase) => turnoClase.idPublico === turno.idPublico,
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
    this.actualizarYOrdenarTurnos(turnoActualizado);

    this.metadatos.updatedAt = new Date().toISOString();
    this.metadatos.updatedBy = this.idProfesor;
  }

  private insertarEnOrden(turno: Turno) {
    let i = 0;
    const nuevosTurnos = [...this.turnos];
    while (i < nuevosTurnos.length && turno.dia > nuevosTurnos[i].dia) {
      i++;
    }
    while (
      i < nuevosTurnos.length &&
      turno.dia === nuevosTurnos[i].dia &&
      turno.horaInicio > nuevosTurnos[i].horaInicio
    ) {
      i++;
    }
    nuevosTurnos.splice(i, 0, turno);
    return nuevosTurnos;
  }

  nuevoTurno(turno: Turno) {
    this.checkHoras(turno);
    this.checkOtrosTurnos(turno);
    this.turnos = this.insertarEnOrden(turno);

    this.metadatos.updatedAt = new Date().toISOString();
    this.metadatos.updatedBy = this.idProfesor;
  }

  borrarTurno(idTurno: string) {
    const turnoIndex = this.turnos.findIndex(
      (turno) => turno.idPublico === idTurno,
    );
    if (turnoIndex === -1) {
      throw new ErrorFormanderaNotFound('No se ha encontrado el turno');
    } else if (this.turnos[turnoIndex].idAlumnos.length > 0) {
      throw new ErrorFormanderaBadRequest(
        'No se puede borrar un turno con alumnos apuntados.',
      );
    }

    this.turnos.splice(turnoIndex, 1);

    this.metadatos.updatedAt = new Date().toISOString();
    this.metadatos.updatedBy = this.idProfesor;
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
