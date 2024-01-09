export class QueryEntidad {
  keyword?: string;
  tipo?: string;
  asignaturas?: string[];
  take?: number;
  skip?: number;

  constructor({
    keyword,
    tipo,
    asignaturas,
    precioMin,
    precioMax,
    take,
    skip,
  }: {
    keyword?: string;
    tipo?: string;
    asignaturas?: string[];
    precioMin?: number;
    precioMax?: number;
    take?: number;
    skip?: number;
  }) {
    this.keyword = keyword ?? '';
    this.tipo = tipo ?? 'docente';
    this.asignaturas = asignaturas ?? [];
    this.take = take ?? undefined;
    this.skip = skip ?? 0;
  }
}
