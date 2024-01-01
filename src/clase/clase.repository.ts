import { IGenericRepository } from 'src/base/generic.repository';
import { Clase } from './entities/clase.entity';

export abstract class ClaseRepository extends IGenericRepository<Clase> {}
