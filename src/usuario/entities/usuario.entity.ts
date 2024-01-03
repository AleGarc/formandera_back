import { Metadatos } from 'src/base/metadatos';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Role } from '../roles/role.enum';
import { PartialType } from '@nestjs/mapped-types';
interface UsuarioProps {
  _idDB?: string;
  idPublico?: string;
  username: string;
  nombre: string;
  biografia?: string;
  email: string;
  password: string;
  role: string;
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
    this.metadatos = metadatos;
  }
}

export class UsuarioUpdate extends PartialType(Usuario) {}

interface AlumnoProps extends UsuarioProps {
  turnos: string[];
}

export class Alumno extends Usuario {
  turnos: string[];
  constructor({
    _idDB,
    idPublico,
    username,
    nombre,
    biografia,
    email,
    password,
    role,
    metadatos,
    turnos,
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
      metadatos,
    });
    this.turnos = turnos;
  }
}

interface DocenteProps extends UsuarioProps {
  asignaturas: string[];
  clase: string;
}

export class Docente extends Usuario {
  asignaturas: string[];
  clase: string;

  constructor({
    _idDB,
    idPublico,
    username,
    nombre,
    biografia,
    email,
    password,
    role,
    metadatos,
    asignaturas,
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
    });
    this.asignaturas = asignaturas;
    this.clase = clase;
  }
}

export function crearUsuario(
  idPublico: string,
  createUsuarioDto: CreateUsuarioDto,
): Alumno | Docente | null {
  switch (createUsuarioDto.role) {
    case 'alumno': {
      const props = createUsuarioDto as AlumnoProps;
      return new Alumno({
        idPublico: idPublico,
        ...props,
        metadatos: {
          createdBy: idPublico,
          createdAt: new Date().toISOString(),
          updatedBy: '',
          updatedAt: '',
        },
        role: Role.Alumno,
        turnos: [],
      });
      break;
    }
    case 'docente': {
      const props = createUsuarioDto as DocenteProps;
      return new Docente({
        idPublico: idPublico,
        ...props,
        metadatos: {
          createdBy: idPublico,
          createdAt: new Date().toISOString(),
          updatedBy: '',
          updatedAt: '',
        },
        role: Role.Docente,
        asignaturas: [],
        clase: '',
      });
      break;
    }
    default:
      return null;
  }
}
