export class UsuarioDto {
  idPublico: string;
  username: string;
  nombre: string;
  biografia?: string;
  email: string;
  role: string;
  comentarios: string[];
  turnos?: string[];
  curso_academico?: string;
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
    comentarios,
    turnos,
    curso_academico,
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
    comentarios: string[];
    turnos?: string[];
    curso_academico?: string;
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
    this.comentarios = comentarios;
    this.turnos = turnos;
    this.curso_academico = curso_academico;
    this.educacion = educacion;
    this.asignaturas = asignaturas;
    this.experiencia = experiencia;
    this.clase = clase;
  }
}
