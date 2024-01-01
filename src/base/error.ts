export class ErrorFormandera {
  codigo: string;
  mensaje: string;

  constructor({ codigo, mensaje }: { codigo: string; mensaje: string }) {
    this.codigo = codigo;
    this.mensaje = mensaje;
  }
}
