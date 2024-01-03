import { Inject, Injectable } from '@nestjs/common';
import { CreateClaseDto } from './dto/create-clase.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';
import { ClaseRepository } from './clase.repository';
import { Clase } from './entities/clase.entity';
import { v4 as uuidv4 } from 'uuid';
import { ErrorFormandera } from 'src/base/error';
import { ClaseDto } from './dto/clase.dto';

@Injectable()
export class ClaseService {
  constructor(
    @Inject(ClaseRepository) private claseRepository: ClaseRepository,
  ) {}
  create(createClaseDto: CreateClaseDto) {
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
  }

  findAll() {
    return `This action returns all clase`;
  }

  async findOne(id: string) {
    const claseDB = await this.claseRepository.get(id);
    //mover esto al controlador
    return new ClaseDto(claseDB);
  }

  update(id: string, updateClaseDto: UpdateClaseDto) {
    console.log(updateClaseDto);
    return `This action updates a #${id} clase`;
  }

  async remove(id: string) {
    try {
      await this.claseRepository.delete(id);
    } catch (error) {
      //Esto se hace en el repositorio
      //return new ErrorFormandera({ codigo: '404', mensaje: error.message });
    }
  }
}
