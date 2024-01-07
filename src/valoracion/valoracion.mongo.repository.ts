import { HydratedDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { ValoracionRepository } from './valoracion.repository';

import {
  ErrorFormanderaConflict,
  ErrorFormanderaNotFound,
} from 'src/base/error';
import { ValoracionMongoModel } from './valoracion.schema';
import { Valoracion } from './entities/valoracion.entity';

export class ValoracionRepositoryMongo extends ValoracionRepository {
  constructor(
    @InjectModel(ValoracionMongoModel.name)
    private readonly valoracionModel: Model<ValoracionMongoModel>,
  ) {
    super();
  }

  //Las búsquedas se realizarán por el id público.

  async create(item: Valoracion): Promise<Valoracion> {
    const valoracionEncontrada = await this.valoracionModel
      .findOne({ idPublico: item.idPublico })
      .exec();
    if (valoracionEncontrada !== null) {
      throw new ErrorFormanderaConflict(
        `Ya existe una valoración con id ${item.idPublico}`,
      );
    }

    //Una vez creada la valoración, se introduce el id de la base de datos.
    const createdValoracionMongo = await this.valoracionModel.create(item);
    item._idDB = createdValoracionMongo._id.toString();
    const newValoracion = new Valoracion(item);
    return newValoracion;
  }

  //Mapper de objetos de mongodb a objetos de dominio.
  private valoracionToDomain(
    valoracionMongo: HydratedDocument<ValoracionMongoModel>,
  ): Valoracion {
    if (valoracionMongo) {
      const valoracion = new Valoracion({
        _idDB: valoracionMongo._id.toString(),
        ...valoracionMongo.toObject(),
      });
      return valoracion;
    }
  }

  async get(id: string): Promise<Valoracion> {
    const valoracionMongo = await this.valoracionModel
      .findOne({ idPublico: id })
      .exec();
    if (valoracionMongo === null) {
      throw new ErrorFormanderaNotFound(`No existe la valoracion con id ${id}`);
    } else return this.valoracionToDomain(valoracionMongo);
  }

  async getAll(): Promise<Valoracion[]> {
    const valoracionesMongo = await this.valoracionModel.find().exec();
    return valoracionesMongo.map((valoracionMongo) =>
      this.valoracionToDomain(valoracionMongo),
    );
  }

  async update(id: string, item: Valoracion): Promise<Valoracion> {
    const newValoracion = await this.valoracionModel.findOneAndUpdate(
      { idPublico: id },
      item,
      { new: true },
    );
    if (newValoracion === null)
      throw new ErrorFormanderaNotFound(`No existe la valoración con id ${id}`);
    else return this.valoracionToDomain(newValoracion);
  }

  async delete(id: string): Promise<Valoracion> | never {
    const valoracion = await this.get(id);
    if (valoracion === undefined)
      throw new ErrorFormanderaNotFound(`No existe la valoración con id ${id}`);
    else {
      await this.valoracionModel.findOneAndDelete({ idPublico: id }).exec();
      return valoracion;
    }
  }
}
