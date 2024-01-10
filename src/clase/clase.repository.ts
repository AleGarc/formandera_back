import { IGenericRepository } from 'src/base/generic.repository';
import { Clase } from './entities/clase.entity';
import { QueryEntidad } from './entities/query.entity';

export abstract class ClaseRepository extends IGenericRepository<Clase> {
  abstract getByQuery(queryEntidad: QueryEntidad): Promise<Clase[]>;
  abstract getByAlumno(idAlumno: string): Promise<Clase[]>;
}
