import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  AlumnoDocument,
  AlumnoMongoModel,
  DocenteDocument,
  DocenteMongoModel,
} from './usuario.schema';
import { UsuarioRepository } from './usuario.repository';
import { Alumno, Docente, Usuario } from './entities/usuario.entity';
import { Role } from './roles/role.enum';
import {
  ErrorFormanderaBadRequest,
  ErrorFormanderaConflict,
  ErrorFormanderaNotFound,
} from 'src/base/error';
import { QueryEntidad } from './entities/query.entity';

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
    //Comprobación de que no exista un usuario con el mismo email o username
    let usuarioEmail = undefined;
    try {
      usuarioEmail = await this.getByEmail(item.email);
    } catch (ErrorFormanderaNotFound) {}
    if (usuarioEmail)
      throw new ErrorFormanderaConflict(
        `Ya existe un usuario con email ${item.email}`,
      );

    let usuarioUsername = undefined;
    try {
      usuarioUsername = await this.getByUsername(item.username);
    } catch (ErrorFormanderaNotFound) {}
    if (usuarioUsername)
      throw new ErrorFormanderaConflict(
        `Ya existe un usuario con username ${item.username}`,
      );

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
  private alumnoToUsuarioDomain(alumnoMongo: AlumnoDocument): Usuario {
    if (alumnoMongo) {
      const alumno = new Alumno({
        _idDB: alumnoMongo._id.toString(),
        ...alumnoMongo.toObject(),
      });
      return alumno;
    }
  }

  private docenteToUsuarioDomain(docenteMongo: DocenteDocument): Usuario {
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

  async getByQuery(queryEntidad: QueryEntidad): Promise<Usuario[]> {
    const filtroAsignaturas =
      queryEntidad.asignaturas.length > 0
        ? { asignaturas: { $in: queryEntidad.asignaturas } }
        : { asignaturas: { $exists: true } };

    if (queryEntidad.tipo === Role.Docente) {
      const docentesMongo = await this.docenteModel
        .find(
          {
            ...filtroAsignaturas,
          },
          null,
          { limit: queryEntidad.take, skip: queryEntidad.skip },
        )
        .exec();

      return docentesMongo.map((docenteMongo) =>
        this.docenteToUsuarioDomain(docenteMongo),
      );
    } else
      return (await this.docenteModel.find().exec()).map((docenteMongo) =>
        this.docenteToUsuarioDomain(docenteMongo),
      );
  }

  async getAll(): Promise<Usuario[]> {
    const alumnosMongo = await this.alumnoModel.find().exec();

    return alumnosMongo.map((alumnoMongo) =>
      this.alumnoToUsuarioDomain(alumnoMongo),
    );
  }

  async update(id: string, item: Usuario): Promise<Usuario> {
    //Comprobación de que no exista un usuario con el mismo email o username
    let usuarioEmail = undefined;
    try {
      usuarioEmail = await this.getByEmail(item.email);
      console.log(usuarioEmail);
    } catch (ErrorFormanderaNotFound) {}
    if (usuarioEmail && usuarioEmail.idPublico !== id)
      throw new ErrorFormanderaConflict(
        `Ya existe un usuario con email ${item.email}`,
      );

    let usuarioUsername = undefined;
    try {
      usuarioUsername = await this.getByUsername(item.username);
      console.log(usuarioUsername);
    } catch (ErrorFormanderaNotFound) {}
    if (usuarioUsername && usuarioUsername.idPublico !== id)
      throw new ErrorFormanderaConflict(
        `Ya existe un usuario con username ${item.username}`,
      );

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

  async getByUsername(username: string): Promise<Usuario> | never {
    const alumnoEncontrado = await this.alumnoModel
      .findOne({ username: username })
      .exec();
    if (alumnoEncontrado === null) {
      const docenteEncontrado = await this.docenteModel
        .findOne({ username: username })
        .exec();
      if (docenteEncontrado === null) {
        throw new ErrorFormanderaNotFound(
          `No existe el usuario con username ${username}`,
        );
      } else return this.docenteToUsuarioDomain(docenteEncontrado);
    } else return this.alumnoToUsuarioDomain(alumnoEncontrado);
  }

  async getByComentario(idComentario: string): Promise<Usuario[]> {
    const alumnosMongo = await this.alumnoModel
      .find({ comentarios: { $in: [idComentario] } })
      .exec();
    const docentesMongo = await this.docenteModel
      .find({ comentarios: { $in: [idComentario] } })
      .exec();

    const alumnos = alumnosMongo.map((alumnoMongo) =>
      this.alumnoToUsuarioDomain(alumnoMongo),
    );
    const docentes = docentesMongo.map((docenteMongo) =>
      this.docenteToUsuarioDomain(docenteMongo),
    );

    const usuarios = alumnos.concat(docentes);
    return usuarios;
  }
}
