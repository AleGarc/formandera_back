import { Module } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { ClaseController } from './clase.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClaseMongoModel, ClaseSchema } from './clase.schema';
import { ClaseRepository } from './clase.repository';
import { ClaseRepositoryMongo } from './clase.mongo.repository';
import { ValoracionModule } from 'src/valoracion/valoracion.module';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [
    ValoracionModule,
    UsuarioModule,
    MongooseModule.forFeature([
      { name: ClaseMongoModel.name, schema: ClaseSchema },
    ]),
  ],
  controllers: [ClaseController],
  providers: [
    ClaseService,
    { provide: ClaseRepository, useClass: ClaseRepositoryMongo },
  ],
})
export class ClaseModule {}
