import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Comentario } from './entities/valoracion.entity';

export type ValoracionDocument = HydratedDocument<ValoracionMongoModel>;

@Schema()
export class ValoracionMongoModel {
  @Prop({ required: true })
  idPublico: string;

  @Prop({ required: true })
  calificacion: number;

  @Prop({ required: true, type: [Comentario] })
  comentarios: Comentario[];
}

export const ValoracionSchema =
  SchemaFactory.createForClass(ValoracionMongoModel);
