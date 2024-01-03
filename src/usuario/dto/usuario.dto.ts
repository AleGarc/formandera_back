export class UsuarioDto {
  idPublico: string;
  username: string;
  nombre: string;
  biografia?: string;
  email: string;
  role: string;
  turnos?: string[];
  asignaturas?: string[];
  clase?: string;
  constructor({
    idPublico,
    username,
    nombre,
    biografia,
    email,
    role,
    turnos,
    asignaturas,
    clase,
  }: {
    idPublico: string;
    username: string;
    nombre: string;
    biografia?: string;
    email: string;
    role: string;
    turnos?: string[];
    asignaturas?: string[];
    clase?: string;
  }) {
    this.idPublico = idPublico;
    this.username = username;
    this.nombre = nombre;
    this.biografia = biografia;
    this.email = email;
    this.role = role;
    this.turnos = turnos;
    this.asignaturas = asignaturas;
    this.clase = clase;
  }
}
