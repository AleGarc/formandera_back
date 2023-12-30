export class CreateClaseDto {
  nombre: string;
  descripcion: string;
  id_profesor: number;
  asignaturas: string[];
  turnos: Record<string, string>;
}
