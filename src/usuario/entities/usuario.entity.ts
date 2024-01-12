import { Metadatos } from 'src/base/metadatos';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Role } from '../roles/role.enum';
import {
  ErrorFormanderaConflict,
  ErrorFormanderaNotFound,
} from 'src/base/error';
interface UsuarioProps {
  _idDB?: string;
  idPublico?: string;
  username: string;
  nombre: string;
  biografia?: string;
  email: string;
  password: string;
  role: string;
  comentarios: string[];
  metadatos: Metadatos;
}

export class Usuario {
  _idDB: string;
  idPublico: string;
  username: string;
  nombre: string;
  biografia?: string;
  email: string;
  password: string;
  role: string;
  comentarios: string[];
  metadatos: Metadatos;

  constructor({
    _idDB,
    idPublico,
    username,
    nombre,
    biografia,
    email,
    password,
    role,
    comentarios,
    metadatos,
  }: UsuarioProps) {
    this._idDB = _idDB || '';
    this.idPublico = idPublico || '';
    this.username = username;
    this.nombre = nombre;
    this.biografia = biografia;
    this.email = email;
    this.password = password;
    this.role = role;
    this.comentarios = comentarios ?? [];
    this.metadatos = metadatos;
  }

  agregarComentario(idComentario: string) {
    if (!this.comentarios.includes(idComentario)) {
      this.comentarios.push(idComentario);
    } else {
      throw new ErrorFormanderaConflict(
        `El comentario ${idComentario} ya está agregado al usuario ${this.idPublico}`,
      );
    }
  }

  eliminarComentario(idComentario: string) {
    if (this.comentarios.includes(idComentario)) {
      this.comentarios = this.comentarios.filter((id) => id !== idComentario);
    } else {
      throw new ErrorFormanderaNotFound(
        `El comentario ${idComentario} no está agregado al usuario ${this.idPublico}`,
      );
    }
  }
}

interface AlumnoProps extends UsuarioProps {
  turnos: string[];
  curso_academico: string;
}

export class Alumno extends Usuario {
  turnos: string[];
  curso_academico: string;
  constructor({
    _idDB,
    idPublico,
    username,
    nombre,
    biografia,
    email,
    password,
    role,
    comentarios,
    metadatos,
    turnos,
    curso_academico,
  }: AlumnoProps) {
    super({
      _idDB,
      idPublico,
      username,
      nombre,
      biografia,
      email,
      password,
      role,
      comentarios,
      metadatos,
    });
    this.turnos = turnos;
    this.curso_academico = curso_academico;
  }

  expulsar(idTurno: string) {
    if (this.turnos.includes(idTurno)) {
      this.turnos = this.turnos.filter((id) => id !== idTurno);
    } else {
      throw new ErrorFormanderaNotFound(
        `El alumno ${this.idPublico} no está apuntado en el turno ${idTurno}`,
      );
    }
  }
}

interface DocenteProps extends UsuarioProps {
  educacion?: string[];
  asignaturas?: string[];
  experiencia?: string[];
  clase?: string;
}

export class Docente extends Usuario {
  educacion?: string[];
  asignaturas?: string[];
  experiencia?: string[];
  clase?: string;

  constructor({
    _idDB,
    idPublico,
    username,
    nombre,
    biografia,
    email,
    password,
    role,
    comentarios,
    metadatos,
    educacion,
    asignaturas,
    experiencia,
    clase,
  }: DocenteProps) {
    super({
      _idDB,
      idPublico,
      username,
      nombre,
      biografia,
      email,
      password,
      role,
      metadatos,
      comentarios,
    });
    this.educacion = educacion;
    this.asignaturas = asignaturas;
    this.experiencia = experiencia;
    this.clase = clase;
  }
}

export function crearUsuario(
  createUsuarioDto: CreateUsuarioDto,
): Alumno | Docente | null {
  switch (createUsuarioDto.role) {
    case 'alumno': {
      const props = createUsuarioDto as AlumnoProps;
      return new Alumno({
        idPublico: undefined,
        ...props,
        metadatos: {
          createdBy: undefined,
          createdAt: new Date().toISOString(),
          updatedBy: '',
          updatedAt: '',
        },
        role: Role.Alumno,
        turnos: [],
        curso_academico: '',
      });
      break;
    }
    case 'docente': {
      const props = createUsuarioDto as DocenteProps;
      return new Docente({
        idPublico: undefined,
        ...props,
        metadatos: {
          createdBy: undefined,
          createdAt: new Date().toISOString(),
          updatedBy: '',
          updatedAt: '',
        },
        role: Role.Docente,
        educacion: [],
        asignaturas: [],
      });
      break;
    }
    default:
      return null;
  }
}
