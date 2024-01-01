export class Metadatos {
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  constructor({
    createdBy,
    createdAt,
    updatedBy,
    updatedAt,
  }: {
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  }) {
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedBy = updatedBy;
    this.updatedAt = updatedAt;
  }
}
