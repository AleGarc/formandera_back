import { IGenericRepository } from 'src/base/generic.repository';
import { Usuario } from './entities/usuario.entity';
import { QueryEntidad } from './entities/query.entity';

export abstract class UsuarioRepository extends IGenericRepository<Usuario> {
  abstract getByEmail(email: string): Promise<Usuario>;
  abstract getByUsername(username: string): Promise<Usuario>;
  abstract getByQuery(queryEntidad: QueryEntidad): Promise<Usuario[]>;
}
