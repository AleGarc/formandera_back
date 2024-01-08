import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Metadatos } from 'src/base/metadatos';

export type AlumnoDocument = HydratedDocument<AlumnoMongoModel>;

@Schema()
export class AlumnoMongoModel {
  @Prop({ required: true })
  idPublico: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: false })
  biografia: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true, type: [String] })
  comentarios: string[];

  @Prop({ required: true })
  metadatos: Metadatos;

  @Prop({ required: true, type: [String] })
  turnos: string[];

  @Prop({ required: false })
  curso_academico: string;
}

export const AlumnoSchema = SchemaFactory.createForClass(AlumnoMongoModel);

export type DocenteDocument = HydratedDocument<DocenteMongoModel>;

@Schema()
export class DocenteMongoModel {
  @Prop({ required: true })
  idPublico: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: false })
  biografia: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true, type: [String] })
  comentarios: string[];

  @Prop({ required: true })
  metadatos: Metadatos;

  @Prop({ required: false, type: [String] })
  educacion: string[];

  @Prop({ required: false, type: [String] })
  asignaturas: string[];

  @Prop({ required: false, type: [String] })
  experiencia: string[];

  @Prop({ required: false })
  clase: string;
}

export const DocenteSchema = SchemaFactory.createForClass(DocenteMongoModel);
