import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Comentario } from './entities/valoracion.entity';
import { Metadatos } from 'src/base/metadatos';

export type ValoracionDocument = HydratedDocument<ValoracionMongoModel>;

@Schema()
export class ValoracionMongoModel {
  @Prop({ required: true })
  idPublico: string;

  @Prop({ required: true })
  puntuacion: number;

  @Prop({ required: true, type: [Comentario] })
  comentarios: Comentario[];

  @Prop({ required: true })
  metadatos: Metadatos;
}

export const ValoracionSchema =
  SchemaFactory.createForClass(ValoracionMongoModel);
