export class UsuarioDto {
  idPublico: string;
  username: string;
  nombre: string;
  biografia?: string;
  email: string;
  role: string;
  turnos?: string[];
  educacion?: string[];
  asignaturas?: string[];
  experiencia?: string[];
  clase?: string;

  constructor({
    idPublico,
    username,
    nombre,
    biografia,
    email,
    role,
    turnos,
    educacion,
    asignaturas,
    experiencia,
    clase,
  }: {
    idPublico: string;
    username: string;
    nombre: string;
    biografia?: string;
    email: string;
    role: string;
    turnos?: string[];
    educacion?: string[];
    asignaturas?: string[];
    experiencia?: string[];
    clase?: string;
  }) {
    this.idPublico = idPublico;
    this.username = username;
    this.nombre = nombre;
    this.biografia = biografia;
    this.email = email;
    this.role = role;
    this.turnos = turnos;
    this.educacion = educacion;
    this.asignaturas = asignaturas;
    this.experiencia = experiencia;
    this.clase = clase;
  }
}
