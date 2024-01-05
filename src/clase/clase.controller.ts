import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ClaseService } from './clase.service';
import { CreateClaseDto, CreateTurnoDto } from './dto/create-clase.dto';
import { UpdateClaseDto, UpdateTurnoDto } from './dto/update-clase.dto';
import { Public } from 'src/auth/public.decorator';
import { Response } from 'express';
import {
  ErrorFormanderaBadRequest,
  ErrorFormanderaNotFound,
} from 'src/base/error';
import { ClaseDto, TurnoDto } from './dto/clase.dto';
import { ApuntarDto } from './dto/apuntar.dto';
import { Clase, Turno } from './entities/clase.entity';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/usuario/roles/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { v4 as uuidv4 } from 'uuid';

@Controller('clase')
export class ClaseController {
  constructor(private readonly claseService: ClaseService) {}

  //quitar esto
  @Public()
  @Post()
  create(@Body() createClaseDto: CreateClaseDto) {
    //pasar de dto a dominio
    return this.claseService.create(createClaseDto);
  }

  /*   @Get()
  findAll() {
    return this.claseService.findAll();
  } */

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.claseService.findOne(id);
  }

  @Roles(Role.Docente)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateClaseDto: UpdateClaseDto,
  ) {
    try {
      const clase = new Clase({
        idPublico: id,
        nombre: updateClaseDto.nombre,
        descripcion: updateClaseDto.descripcion,
        precio: updateClaseDto.precio,
        idProfesor: updateClaseDto.idProfesor,
        asignaturas: updateClaseDto.asignaturas,
        turnos: [],
        metadatos: {
          createdBy: '',
          createdAt: '',
          updatedBy: '',
          updatedAt: '',
        },
      });
      const claseActualizada = await this.claseService.update(id, clase);
      response.status(200).json(new ClaseDto(claseActualizada)).send();
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
      } else {
        response.json(error).send();
      }
    }
  }

  @Roles(Role.Docente)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.claseService.remove(id);
  }

  @Roles(Role.Alumno)
  @UseGuards(RolesGuard)
  @Post(':id/turnos')
  async apuntarAlumno(
    @Res() response: Response,
    @Param('id') idClase: string,
    @Body() apuntarDto: ApuntarDto,
  ) {
    try {
      const clase = await this.claseService.apuntarAlumno(
        idClase,
        apuntarDto.idTurno,
        apuntarDto.idAlumno,
        apuntarDto.apuntarse,
      );
      response.status(200).json(new ClaseDto(clase)).send();
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
      } else if (error instanceof ErrorFormanderaBadRequest) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new BadRequestException(error.message))
          .send();
      } else {
        response.json(error).send();
      }
    }
  }

  @Roles(Role.Docente)
  @UseGuards(RolesGuard)
  @Patch(':id/turnos')
  async modificarTurno(
    @Res() response: Response,
    @Param('id') idClase: string,
    @Body() updateTurnoDto: UpdateTurnoDto,
  ) {
    try {
      const turno = new Turno({
        idPublico: updateTurnoDto.idPublico,
        dia: updateTurnoDto.dia,
        asignatura: updateTurnoDto.asignatura,
        horaInicio: updateTurnoDto.horaInicio,
        horaFin: updateTurnoDto.horaFin,
        alumnosMax: updateTurnoDto.alumnosMax,
        idAlumnos: updateTurnoDto.idAlumnos,
      });
      const nuevoTurno = await this.claseService.modificarTurno(idClase, turno);
      response.status(200).json(new TurnoDto(nuevoTurno)).send();
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
      } else if (error instanceof ErrorFormanderaBadRequest) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new BadRequestException(error.message))
          .send();
      } else {
        response.json(error).send();
      }
    }
  }

  @Roles(Role.Docente)
  @UseGuards(RolesGuard)
  @Put(':id/turnos')
  async nuevoTurno(
    @Res() response: Response,
    @Param('id') idClase: string,
    @Body() CreateTurnoDto: CreateTurnoDto,
  ) {
    try {
      const turno = new Turno({
        idPublico: uuidv4(),
        dia: CreateTurnoDto.dia,
        asignatura: CreateTurnoDto.asignatura,
        horaInicio: CreateTurnoDto.horaInicio,
        horaFin: CreateTurnoDto.horaFin,
        alumnosMax: CreateTurnoDto.alumnosMax,
        idAlumnos: [],
      });
      const nuevoTurno = await this.claseService.nuevoTurno(idClase, turno);
      response.status(201).json(new ClaseDto(nuevoTurno)).send();
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
      } else if (error instanceof ErrorFormanderaBadRequest) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new BadRequestException(error.message))
          .send();
      } else {
        response.json(error).send();
      }
    }
  }

  @Roles(Role.Docente)
  @UseGuards(RolesGuard)
  @Delete(':id/turnos/:idTurno')
  async borrarTurno(
    @Res() response: Response,
    @Param('id') idClase: string,
    @Param('idTurno') idTurno: string,
  ) {
    try {
      await this.claseService.borrarTurno(idClase, idTurno);
      response.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
      } else if (error instanceof ErrorFormanderaBadRequest) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new BadRequestException(error.message))
          .send();
      } else {
        response.json(error).send();
      }
    }
  }
}
