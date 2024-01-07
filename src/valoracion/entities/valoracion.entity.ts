import {
  ErrorFormanderaConflict,
  ErrorFormanderaNotFound,
} from 'src/base/error';

//Calificación será un valor calculado en base a los comentarios.
export class Valoracion {
  _idDB?: string;
  idPublico: string;
  calificacion: number;
  comentarios: Comentario[];

  constructor({
    _idDB,
    idPublico,
    calificacion,
    comentarios,
  }: {
    _idDB?: string;
    idPublico: string;
    calificacion: number;
    comentarios: Comentario[];
  }) {
    this._idDB = _idDB;
    this.idPublico = idPublico;
    this.comentarios = comentarios;
    this.calificacion =
      calificacion === this.calcularCalificacionMedia()
        ? calificacion
        : this.calcularCalificacionMedia();
  }

  private calcularCalificacionMedia(): number {
    if (this.comentarios.length === 0) {
      return 0;
    }

    const sumatoriaCalificaciones = this.comentarios.reduce(
      (sum, comentario) => sum + comentario.calificacion,
      0,
    );

    return sumatoriaCalificaciones / this.comentarios.length;
  }

  //Si se encuentra un comentario con el mismo autor se devuelve error.
  agregarComentario(comentario: Comentario): void {
    const comentarioExistente = this.comentarios.some(
      (com) => com.idAutor === comentario.idAutor,
    );

    if (comentarioExistente) {
      throw new ErrorFormanderaConflict(
        'Ya existe un comentario de este usuario',
      );
    } else {
      this.comentarios.push(comentario);
      this.calificacion = this.calcularCalificacionMedia();
    }
  }

  //Si NO se encuentra el comentario con el mismo autor se devuelve error.
  modificarComentario(comentario: Comentario): void {
    const comentarioExistente = this.comentarios.some(
      (com) => com.idAutor === comentario.idAutor,
    );

    if (comentarioExistente) {
      this.comentarios = this.comentarios.map((com) =>
        com.idAutor === comentario.idAutor ? comentario : com,
      );
      this.calificacion = this.calcularCalificacionMedia();
    } else {
      throw new ErrorFormanderaNotFound(
        'No existe un comentario de este usuario',
      );
    }
  }

  //Si NO se encuentra el comentario con el mismo autor se devuelve error.
  eliminarComentario(idAutor: string): void {
    const comentarioExistente = this.comentarios.some(
      (com) => com.idAutor === idAutor,
    );

    if (comentarioExistente) {
      this.comentarios = this.comentarios.filter(
        (com) => com.idAutor !== idAutor,
      );
      this.calificacion = this.calcularCalificacionMedia();
    } else {
      throw new ErrorFormanderaNotFound(
        'No existe un comentario de este usuario',
      );
    }
  }
}

export class Comentario {
  idAutor: string;
  nombreAutor: string;
  calificacion: number;
  mensaje: string;

  constructor({
    idAutor,
    nombreAutor,
    calificacion,
    mensaje,
  }: {
    idAutor: string;
    nombreAutor: string;
    calificacion: number;
    mensaje: string;
  }) {
    this.idAutor = idAutor;
    this.nombreAutor = nombreAutor;
    this.calificacion = calificacion;
    this.mensaje = mensaje;
  }
}
