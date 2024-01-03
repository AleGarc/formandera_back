import { Inject, Injectable } from '@nestjs/common';
import { UsuarioRepository } from './usuario.repository';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

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

  findByUsername(username: string) {
    return this.usuarioRepository.getByEmail(username);
  }

  async create(nuevoUsuario: Usuario) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(nuevoUsuario.password, saltRounds);
    nuevoUsuario.password = hashedPassword;
    return this.usuarioRepository.create(nuevoUsuario);
  }

  async update(id: string, usuarioActualizado: Usuario) {
    return this.usuarioRepository.update(id, usuarioActualizado);
  }

  findAll() {
    return this.usuarioRepository.getAll();
  }

  remove(id: string) {
    return this.usuarioRepository.delete(id);
  }
}
