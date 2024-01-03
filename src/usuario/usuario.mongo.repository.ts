import { HydratedDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AlumnoMongoModel, DocenteMongoModel } from './usuario.schema';
import { UsuarioRepository } from './usuario.repository';
import { Usuario, UsuarioUpdate } from './entities/usuario.entity';
import { Role } from './roles/role.enum';
import { ErrorFormanderaNotFound } from 'src/base/error';

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
        throw new Error('No se reconoce el rol');
    }

    item._idDB = createdUsuarioMongo._id.toString();
    const newUsuario = new Usuario(item);
    return newUsuario;
  }
  private toUsuarioDomain(
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

  async get(id: string): Promise<Usuario> {
    const alumnoMongo = await this.alumnoModel
      .findOne({ idPublico: id })
      .exec();

    return this.toUsuarioDomain(alumnoMongo);
  }

  async getAll(): Promise<Usuario[]> {
    const alumnosMongo = await this.alumnoModel.find().exec();

    return alumnosMongo.map((alumnoMongo) => this.toUsuarioDomain(alumnoMongo));
  }

  async update(id: string, item: UsuarioUpdate): Promise<Usuario> {
    const newUsuario = await this.alumnoModel.findOneAndUpdate(
      { idPublico: id },
      item,
      { new: true },
    );

    return this.toUsuarioDomain(newUsuario);
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
    const usuarioMongo = await this.alumnoModel
      .findOne({ email: email })
      .exec();

    if (usuarioMongo === null) {
      throw new ErrorFormanderaNotFound(
        `No existe el usuario con email ${email}`,
      );
    } else {
      return this.toUsuarioDomain(usuarioMongo);
    }
  }
}
