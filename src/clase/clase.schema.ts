import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Turno } from './entities/clase.entity';
import { Metadatos } from 'src/base/metadatos';

export type ClaseDocument = HydratedDocument<ClaseMongoModel>;

@Schema()
export class ClaseMongoModel {
  @Prop({ required: true })
  idPublico: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: false })
  precio: number;

  @Prop({ required: true })
  idProfesor: string;

  @Prop({ required: true, type: [String] })
  asignaturas: string[];

  @Prop({ required: true, type: [Turno] })
  turnos: Turno[];

  @Prop({ required: true })
  metadatos: Metadatos;
}

export const ClaseSchema = SchemaFactory.createForClass(ClaseMongoModel);
