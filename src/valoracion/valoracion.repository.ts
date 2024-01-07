import { IGenericRepository } from 'src/base/generic.repository';
import { Valoracion } from './entities/valoracion.entity';

export abstract class ValoracionRepository extends IGenericRepository<Valoracion> {}
