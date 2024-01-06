import { Inject, Injectable } from '@nestjs/common';
import { CreateClaseDto } from './dto/create-clase.dto';
import { ClaseRepository } from './clase.repository';
import { Clase } from './entities/clase.entity';
import { Turno } from './entities/clase.entity';
import { v4 as uuidv4 } from 'uuid';
import { ClaseDto } from './dto/clase.dto';

@Injectable()
export class ClaseService {
  constructor(
    @Inject(ClaseRepository) private claseRepository: ClaseRepository,
  ) {}
  create(createClaseDto: CreateClaseDto) {
    const turnosDto = createClaseDto.turnos;
    const turnos = turnosDto.map((turno) => {
      const nuevoTurno = new Turno({
        idPublico: uuidv4(),
        ...turno,
        idAlumnos: [],
      });
      return nuevoTurno;
    });
    const clase = new Clase({
      idPublico: uuidv4(),
      ...createClaseDto,
      turnos: turnos,
      metadatos: {
        createdBy: createClaseDto.idProfesor,
        createdAt: new Date().toISOString(),
        updatedBy: '',
        updatedAt: '',
      },
    });
    this.claseRepository.create(clase);
    return clase.idPublico;
  }

  findAll() {
    return `This action returns all clase`;
  }

  async findOne(id: string) {
    const claseDB = await this.claseRepository.get(id);
    //mover esto al controlador
    return new ClaseDto(claseDB);
  }

  async update(id: string, clase: Clase) {
    const claseDB = await this.claseRepository.get(id);
    claseDB.modificarClase(clase);
    const claseActualizada = await this.claseRepository.update(id, claseDB);
    return claseActualizada;
  }

  async remove(id: string) {
    try {
      await this.claseRepository.delete(id);
    } catch (error) {
      //Esto se hace en el repositorio
      //return new ErrorFormandera({ codigo: '404', mensaje: error.message });
    }
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
