import { Comentario } from '../entities/valoracion.entity';

export class ValoracionDto {
  idPublico: string;
  puntuacion: number;
  comentarios: ComentarioDto[];

  constructor({
    idPublico,
    puntuacion,
    comentarios,
  }: {
    idPublico: string;
    puntuacion: number;
    comentarios: Comentario[];
  }) {
    this.idPublico = idPublico;
    this.puntuacion = puntuacion;
    this.comentarios = comentarios.map((comentario) => {
      return new ComentarioDto(comentario);
    });
  }
}

export class ComentarioDto {
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
