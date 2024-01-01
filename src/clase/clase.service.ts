import { Inject, Injectable } from '@nestjs/common';
import { CreateClaseDto } from './dto/create-clase.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';
import { ClaseRepository } from './clase.repository';
import { Clase } from './entities/clase.entity';
import { v4 as uuidv4 } from 'uuid';
import { ErrorFormandera } from 'src/base/error';
import { GetClaseDto } from './dto/get-clase.dto';

@Injectable()
export class ClaseService {
  constructor(
    @Inject(ClaseRepository) private claseRepository: ClaseRepository,
  ) {}
  create(createClaseDto: CreateClaseDto) {
    try {
      if (!createClaseDto.nombre)
        throw new Error('No se puede crear una clase sin nombre');
      if (!createClaseDto.descripcion)
        throw new Error('No se puede crear una clase sin descripcion');
      if (!createClaseDto.idProfesor)
        throw new Error('No se puede crear una clase sin idProfesor');
      if (createClaseDto.asignaturas.length === 0)
        throw new Error('No se puede crear una clase sin asignaturas');
      if (createClaseDto.turnos.length === 0)
        throw new Error('No se puede crear una clase sin turnos');

      const clase = new Clase({
        idPublico: uuidv4(),
        ...createClaseDto,
        metadatos: {
          createdBy: createClaseDto.idProfesor,
          createdAt: new Date().toISOString(),
          updatedBy: '',
          updatedAt: '',
        },
      });
      this.claseRepository.create(clase);
      return clase.idPublico;
    } catch (error) {
      return new ErrorFormandera({ codigo: '400', mensaje: error.message });
    }
  }

  findAll() {
    return `This action returns all clase`;
  }

  async findOne(id: string) {
    const claseDB = await this.claseRepository.get(id);
    return new GetClaseDto(claseDB);
  }

  update(id: string, updateClaseDto: UpdateClaseDto) {
    console.log(updateClaseDto);
    return `This action updates a #${id} clase`;
  }

  async remove(id: string) {
    try {
      await this.claseRepository.delete(id);
    } catch (error) {
      return new ErrorFormandera({ codigo: '404', mensaje: error.message });
    }
  }
}
