import { HydratedDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AlumnoMongoModel, DocenteMongoModel } from './usuario.schema';
import { UsuarioRepository } from './usuario.repository';
import { Docente, Usuario } from './entities/usuario.entity';
import { Role } from './roles/role.enum';
import {
  ErrorFormanderaBadRequest,
  ErrorFormanderaConflict,
  ErrorFormanderaNotFound,
} from 'src/base/error';

export class UsuarioRepositoryMongo extends UsuarioRepository {
  constructor(
    @InjectModel(AlumnoMongoModel.name)
    private readonly alumnoModel: Model<AlumnoMongoModel>,
    @InjectModel(DocenteMongoModel.name)
    private readonly docenteModel: Model<DocenteMongoModel>,
  ) {
    super();
  }

  async create(item: Usuario): Promise<Usuario> {
    const usuarioEncontrado = await this.alumnoModel
      .findOne({ email: item.email })
      .exec();
    if (usuarioEncontrado !== null) {
      throw new ErrorFormanderaConflict(
        `Ya existe un usuario con email ${item.email}`,
      );
    }
    let createdUsuarioMongo: any;
    switch (item.role) {
      case Role.Alumno: {
        createdUsuarioMongo = await this.alumnoModel.create(item);
        break;
      }
      case Role.Docente: {
        createdUsuarioMongo = await this.docenteModel.create(item);
        break;
      }
      default:
        throw new ErrorFormanderaBadRequest('No se reconoce el rol');
    }

    item._idDB = createdUsuarioMongo._id.toString();
    const newUsuario = new Usuario(item);
    return newUsuario;
  }
  private alumnoToUsuarioDomain(
    alumnoMongo: HydratedDocument<AlumnoMongoModel>,
  ): Usuario {
    if (alumnoMongo) {
      const alumno = new Usuario({
        _idDB: alumnoMongo._id.toString(),
        ...alumnoMongo.toObject(),
      });
      return alumno;
    }
  }

  private docenteToUsuarioDomain(
    docenteMongo: HydratedDocument<DocenteMongoModel>,
  ): Usuario {
    if (docenteMongo) {
      const docente = new Docente({
        _idDB: docenteMongo._id.toString(),
        ...docenteMongo.toObject(),
      });
      return docente;
    }
  }

  async get(id: string): Promise<Usuario> {
    const alumnoMongo = await this.alumnoModel
      .findOne({ idPublico: id })
      .exec();
    if (alumnoMongo === null) {
      const docenteMongo = await this.docenteModel
        .findOne({ idPublico: id })
        .exec();
      if (docenteMongo === null)
        throw new ErrorFormanderaNotFound(`No existe el usuario con id ${id}`);
      else return this.docenteToUsuarioDomain(docenteMongo);
    } else return this.alumnoToUsuarioDomain(alumnoMongo);
  }

  async getAll(): Promise<Usuario[]> {
    const alumnosMongo = await this.alumnoModel.find().exec();

    return alumnosMongo.map((alumnoMongo) =>
      this.alumnoToUsuarioDomain(alumnoMongo),
    );
  }

  async update(id: string, item: Usuario): Promise<Usuario> {
    let newUsuario: any;
    if (item.role === Role.Docente) {
      newUsuario = await this.docenteModel.findOneAndUpdate(
        { idPublico: id },
        item,
        { new: true },
      );
      return this.docenteToUsuarioDomain(newUsuario);
    } else if (item.role === Role.Alumno) {
      newUsuario = await this.alumnoModel.findOneAndUpdate(
        { idPublico: id },
        item,
        { new: true },
      );
      return this.alumnoToUsuarioDomain(newUsuario);
    }
  }

  async delete(id: string): Promise<Usuario> | never {
    const alumno = await this.get(id);
    if (alumno === undefined)
      throw new ErrorFormanderaNotFound(`No existe el usuario con id ${id}`);
    else {
      await this.alumnoModel.findOneAndDelete({ idPublico: id }).exec();
      return alumno;
    }
  }

  async getByEmail(email: string): Promise<Usuario> | never {
    const alumnoEncontrado = await this.alumnoModel
      .findOne({ email: email })
      .exec();
    if (alumnoEncontrado === null) {
      const docenteEncontrado = await this.docenteModel
        .findOne({ email: email })
        .exec();
      if (docenteEncontrado === null) {
        throw new ErrorFormanderaNotFound(
          `No existe el usuario con email ${email}`,
        );
      } else return this.docenteToUsuarioDomain(docenteEncontrado);
    } else return this.alumnoToUsuarioDomain(alumnoEncontrado);
  }
}
