import { Inject, Injectable } from '@nestjs/common';
import { ClaseRepository } from './clase.repository';
import { Clase } from './entities/clase.entity';
import { Turno } from './entities/clase.entity';
import { v4 as uuidv4 } from 'uuid';
import { ValoracionService } from 'src/valoracion/valoracion.service';

@Injectable()
export class ClaseService {
  constructor(
    @Inject(ClaseRepository) private claseRepository: ClaseRepository,
    @Inject(ValoracionService) private valoracionService: ValoracionService,
  ) {}
  async create(clase: Clase) {
    clase.idPublico = uuidv4();
    await this.claseRepository.create(clase);
    await this.valoracionService.create(clase.idPublico);
    return clase;
  }

  findAll() {
    return `This action returns all clase`;
  }

  async findOne(id: string) {
    return await this.claseRepository.get(id);
  }

  async update(id: string, clase: Clase) {
    const claseDB = await this.claseRepository.get(id);
    claseDB.modificarClase(clase);
    const claseActualizada = await this.claseRepository.update(id, claseDB);
    return claseActualizada;
  }

  async remove(id: string) {
    await this.claseRepository.delete(id);
    await this.valoracionService.remove(id);
  }

  async apuntarAlumno(
    idClase: string,
    idTurno: string,
    idAlumno: string,
    apuntarse: boolean,
  ): Promise<Clase> {
    const clase = await this.claseRepository.get(idClase);
    clase.apuntarAlumno(idTurno, idAlumno, apuntarse);
    return await this.claseRepository.update(idClase, clase);
  }

  async modificarTurno(idClase: string, turno: Turno): Promise<Turno> {
    const clase = await this.claseRepository.get(idClase);
    clase.cambiarTurno(turno);
    const claseActualizada = await this.claseRepository.update(idClase, clase);
    return claseActualizada.turnos.find(
      (turnoClase) => turnoClase.idPublico === turno.idPublico,
    );
  }

  async nuevoTurno(idClase: string, turno: Turno): Promise<Clase> {
    const clase = await this.claseRepository.get(idClase);
    clase.nuevoTurno(turno);
    const claseActualizada = await this.claseRepository.update(idClase, clase);
    return claseActualizada;
  }

  async borrarTurno(idClase: string, idTurno: string) {
    const clase = await this.claseRepository.get(idClase);
    clase.borrarTurno(idTurno);
    await this.claseRepository.update(idClase, clase);
  }
}
