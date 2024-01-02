import { Inject, Injectable } from '@nestjs/common';
import { Role } from './roles/role.enum';
import { UsuarioRepository } from './usuario.repository';
import { Usuario } from './entities/usuario.entity';

export type User = any;

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(UsuarioRepository)
    private usuarioRepository: UsuarioRepository,
  ) {}
  private readonly users = [
    { userId: 1, username: 'john', password: 'changeme', role: Role.Admin },
    { userId: 2, username: 'jeny', password: 'guess', role: Role.Alumno },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  create(nuevoUsuario: Usuario) {
    return this.usuarioRepository.create(nuevoUsuario);
  }
  /*
  findAll() {
    return `This action returns all usuario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  } */
}
