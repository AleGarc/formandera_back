import { Module } from '@nestjs/common';
import { ValoracionService } from './valoracion.service';
import { ValoracionController } from './valoracion.controller';
import { ValoracionMongoModel, ValoracionSchema } from './valoracion.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ValoracionRepository } from './valoracion.repository';
import { ValoracionRepositoryMongo } from './valoracion.mongo.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ValoracionMongoModel.name, schema: ValoracionSchema },
    ]),
  ],
  controllers: [ValoracionController],
  providers: [
    ValoracionService,
    { provide: ValoracionRepository, useClass: ValoracionRepositoryMongo },
  ],
  exports: [ValoracionService],
})
export class ValoracionModule {}
