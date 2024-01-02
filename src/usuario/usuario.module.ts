import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import {
  AlumnoMongoModel,
  AlumnoSchema,
  DocenteMongoModel,
  DocenteSchema,
} from './usuario.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioRepositoryMongo } from './usuario.mongo.repository';
import { UsuarioRepository } from './usuario.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AlumnoMongoModel.name, schema: AlumnoSchema },
      { name: DocenteMongoModel.name, schema: DocenteSchema },
    ]),
  ],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    { provide: UsuarioRepository, useClass: UsuarioRepositoryMongo },
  ],
  exports: [UsuarioService],
})
export class UsuarioModule {}
