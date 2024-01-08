import { HydratedDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClaseMongoModel } from './clase.schema';
import { Clase } from './entities/clase.entity';
import { ClaseRepository } from './clase.repository';
import {
  ErrorFormanderaConflict,
  ErrorFormanderaNotFound,
} from 'src/base/error';

export class ClaseRepositoryMongo extends ClaseRepository {
  constructor(
    @InjectModel(ClaseMongoModel.name)
    private readonly claseModel: Model<ClaseMongoModel>,
  ) {
    super();
  }

  async create(item: Clase): Promise<Clase> {
    const claseEncontrada = await this.claseModel
      .findOne({ idPublico: item.idPublico })
      .exec();

    if (claseEncontrada !== null) {
      new ErrorFormanderaConflict(
        `Ya existe una clase con id ${item.idPublico}`,
      );
    }

    const claseMismoDocente = await this.claseModel.findOne({
      idProfesor: item.idProfesor,
    });

    if (claseMismoDocente !== null) {
      throw new ErrorFormanderaConflict(
        `El profesor ya tiene una clase creada`,
      );
    }

    const createdClaseMongo = await this.claseModel.create(item); // modelo mongoose
    item._idDB = createdClaseMongo._id.toString();
    const newClase = new Clase(item);
    return newClase;
  }

  private toClaseDomain(claseMongo: HydratedDocument<ClaseMongoModel>): Clase {
    if (claseMongo) {
      const clase = new Clase({
        _idDB: claseMongo._id.toString(),
        ...claseMongo.toObject(),
      });
      return clase;
    }
  }

  async get(id: string): Promise<Clase> {
    const claseMongo = await this.claseModel.findOne({ idPublico: id }).exec();
    if (claseMongo === null)
      throw new ErrorFormanderaNotFound(`No existe la clase con id ${id}`);
    else return this.toClaseDomain(claseMongo);
  }

  async getAll(): Promise<Clase[]> {
    const clasesMongo = await this.claseModel.find().exec();

    return clasesMongo.map((claseMongo) => this.toClaseDomain(claseMongo));
  }

  async update(id: string, item: Clase): Promise<Clase> {
    const newClase = await this.claseModel.findOneAndUpdate(
      { idPublico: id },
      item,
      { new: true },
    );
    if (newClase === null)
      throw new ErrorFormanderaNotFound(`No existe la clase con id ${id}`);
    else return this.toClaseDomain(newClase);
  }

  async delete(id: string): Promise<Clase> | never {
    const clase = await this.get(id);
    if (clase === undefined)
      throw new ErrorFormanderaNotFound(`No existe la clase con id ${id}`);
    else {
      await this.claseModel.findOneAndDelete({ idPublico: id }).exec();
      return clase;
    }
  }

  async getByName(name: string): Promise<Clase> {
    const claseMongo = await this.claseModel.findOne({ name: name }).exec();
    return this.toClaseDomain(claseMongo);
  }
}
