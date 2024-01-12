import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClaseDocument, ClaseMongoModel } from './clase.schema';
import { Clase } from './entities/clase.entity';
import { ClaseRepository } from './clase.repository';
import {
  ErrorFormanderaConflict,
  ErrorFormanderaNotFound,
} from 'src/base/error';
import { QueryEntidad } from './entities/query.entity';

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

  private toClaseDomain(claseMongo: ClaseDocument): Clase {
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

  async getByAlumno(idAlumno: string): Promise<Clase[]> {
    const clasesMongo = await this.claseModel.find({
      turnos: {
        $elemMatch: {
          idAlumnos: idAlumno,
        },
      },
    });
    if (clasesMongo.length === 0)
      throw new ErrorFormanderaNotFound(
        `No existen clases con alumnos apuntados con id ${idAlumno}`,
      );
    else
      return clasesMongo.map((clasesMongo) => this.toClaseDomain(clasesMongo));
  }

  async getByQuery(queryEntidad: QueryEntidad): Promise<Clase[]> {
    const filtroAsignaturas =
      queryEntidad.asignaturas.length > 0
        ? { asignaturas: { $in: queryEntidad.asignaturas } }
        : { asignaturas: { $exists: true } };

    const clasesMongo = await this.claseModel
      .find(
        {
          ...filtroAsignaturas,
          precio: {
            $gte: queryEntidad.precioMin,
            $lte: queryEntidad.precioMax,
          },
        },
        null,
        { limit: queryEntidad.take, skip: queryEntidad.skip },
      )
      .exec();

    return clasesMongo.map((claseMongo) => this.toClaseDomain(claseMongo));
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
