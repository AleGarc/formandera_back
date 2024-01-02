import { HydratedDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AlumnoMongoModel, DocenteMongoModel } from './usuario.schema';
import { UsuarioRepository } from './usuario.repository';
import { Usuario } from './entities/usuario.entity';
import { Role } from './roles/role.enum';

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
    console.log(item);
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

  async update(id: string, item: Usuario): Promise<Usuario> {
    const oldUsuarioMongo = await this.alumnoModel
      .findByIdAndUpdate(id, item)
      .exec();

    const newUsuario = new Usuario({
      ...item,
      _idDB: oldUsuarioMongo._id.toString(),
    });

    return newUsuario;
  }

  async delete(id: string): Promise<Usuario> | never {
    const alumno = await this.get(id);
    if (alumno === undefined)
      throw new Error(`No existe la alumno con id ${id}`);
    else {
      await this.alumnoModel.findOneAndDelete({ idPublico: id }).exec();
      return alumno;
    }
  }

  async getByName(name: string): Promise<Usuario> {
    const alumnoMongo = await this.alumnoModel.findOne({ name: name }).exec();
    return this.toUsuarioDomain(alumnoMongo);
  }
}
