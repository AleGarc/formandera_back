export class QueryEntidad {
  keyword?: string;
  asignaturas?: string[];
  precioMin?: number;
  precioMax?: number;
  take?: number;
  skip?: number;

  constructor({
    keyword,
    asignaturas,
    precioMin,
    precioMax,
    take,
    skip,
  }: {
    keyword?: string;
    asignaturas?: string[];
    precioMin?: number;
    precioMax?: number;
    take?: number;
    skip?: number;
  }) {
    this.keyword = keyword ?? '';
    this.asignaturas = asignaturas ?? [];
    this.precioMin = precioMin ?? 0;
    this.precioMax = precioMax ?? 100;
    this.take = take ?? undefined;
    this.skip = skip ?? 0;
  }
}
