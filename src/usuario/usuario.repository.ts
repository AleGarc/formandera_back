import { IGenericRepository } from 'src/base/generic.repository';
import { Usuario } from './entities/usuario.entity';

export abstract class UsuarioRepository extends IGenericRepository<Usuario> {}
