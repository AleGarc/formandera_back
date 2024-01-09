import { Inject, Injectable } from '@nestjs/common';
import { UsuarioRepository } from './usuario.repository';
import { Alumno, Docente, Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { QueryEntidad } from './entities/query.entity';

export type User = any;

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(UsuarioRepository)
    private usuarioRepository: UsuarioRepository,
  ) {}

  findOne(id: string) {
    return this.usuarioRepository.get(id);
  }

  async findByQuery(queryEntidad: QueryEntidad) {
    const usuarios = await this.usuarioRepository.getByQuery(queryEntidad);

    const palabrasClave = queryEntidad.keyword
      .toLowerCase()
      .split(' ')
      .filter((palabra) => palabra.length > 0);
    if (palabrasClave.length === 0) return usuarios;
    else {
      const usuariosFiltrados = usuarios.filter((usuario) => {
        if (usuario instanceof Docente) {
          const propiedades = [
            usuario.nombre,
            usuario.username,
            usuario.biografia ?? '',
            ...(usuario.educacion ?? []),
            ...(usuario.experiencia ?? []),
            ...(usuario.asignaturas ?? []),
          ].map((propiedad) => propiedad.toLowerCase());
          return palabrasClave.some((palabra) =>
            propiedades.some((propiedad) => propiedad.includes(palabra)),
          );
        }
      });
      return usuariosFiltrados;
    }
  }

  findByUsername(username: string) {
    return this.usuarioRepository.getByUsername(username);
  }

  findByEmail(email: string) {
    return this.usuarioRepository.getByEmail(email);
  }

  async create(nuevoUsuario: Usuario) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(nuevoUsuario.password, saltRounds);
    nuevoUsuario.password = hashedPassword;
    return this.usuarioRepository.create(nuevoUsuario);
  }

  async update(id: string, usuarioActualizado: Usuario) {
    return await this.usuarioRepository.update(id, usuarioActualizado);
  }

  findAll() {
    return this.usuarioRepository.getAll();
  }

  remove(id: string) {
    return this.usuarioRepository.delete(id);
  }

  async expulsarAlumno(idAlumno: string, idTurno: string) {
    const usuario = await this.usuarioRepository.get(idAlumno);
    if (usuario instanceof Alumno) {
      usuario.expulsar(idTurno);
    }
    return await this.usuarioRepository.update(idAlumno, usuario);
  }

  async agregarComentario(idUsuario: string, idComentario: string) {
    const usuario = await this.usuarioRepository.get(idUsuario);
    usuario.agregarComentario(idComentario);
    return await this.usuarioRepository.update(idUsuario, usuario);
  }

  async borrarComentario(idUsuario: string, idComentario: string) {
    const usuario = await this.usuarioRepository.get(idUsuario);
    usuario.eliminarComentario(idComentario);
    return await this.usuarioRepository.update(idUsuario, usuario);
  }
}
