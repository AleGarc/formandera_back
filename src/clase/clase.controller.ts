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
  Request,
  Put,
  Query,
} from '@nestjs/common';
import { ClaseService } from './clase.service';
import { CreateClaseDto, CreateTurnoDto } from './dto/create-clase.dto';
import { UpdateClaseDto, UpdateTurnoDto } from './dto/update-clase.dto';
import { Public } from 'src/auth/public.decorator';
import { Response } from 'express';
import {
  ErrorFormanderaBadRequest,
  ErrorFormanderaNotFound,
  ErrorFormanderaUnauthorized,
} from 'src/base/error';
import { ClaseDto, TurnoDto } from './dto/clase.dto';
import { ApuntarDto } from './dto/apuntar.dto';
import { Clase, Turno } from './entities/clase.entity';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/usuario/roles/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { v4 as uuidv4 } from 'uuid';
import { QueryStringDto } from './dto/query-string.dto';
import { QueryEntidad } from './entities/query.entity';

@Controller('clase')
export class ClaseController {
  constructor(private readonly claseService: ClaseService) {}

  /*  @Roles(Role.Docente)
  @UseGuards(RolesGuard) */
  @Public()
  @Post()
  async create(
    @Res() response: Response,
    @Body() createClaseDto: CreateClaseDto,
  ) {
    try {
      const clase = new Clase({
        ...createClaseDto,
        turnos: [],
        metadatos: {
          createdBy: createClaseDto.idProfesor,
          createdAt: new Date().toISOString(),
          updatedBy: '',
          updatedAt: '',
        },
      });
      const nuevaClase = await this.claseService.create(clase);
      response.status(201).json(new ClaseDto(nuevaClase)).send();
      return;
    } catch (ErrorFormanderaConflict) {
      response
        .status(HttpStatus.CONFLICT)
        .json(ErrorFormanderaConflict.message)
        .send();
      return;
    }
  }

  @Public()
  @Get()
  async findAll(@Query() queryStringDto: QueryStringDto) {
    if (Object.keys(queryStringDto).length === 0)
      return {
        data: (await this.claseService.findAll()).map(
          (clase) => new ClaseDto(clase),
        ),
      };
    const queryEntidad: QueryEntidad = new QueryEntidad(queryStringDto);
    return {
      data: (await this.claseService.findByQuery(queryEntidad)).map(
        (clase) => new ClaseDto(clase),
      ),
      pagination: { take: queryEntidad.take, skip: queryEntidad.skip },
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Res() response: Response, @Param('id') id: string) {
    try {
      const clase = await this.claseService.findOne(id);
      response.status(200).json(new ClaseDto(clase)).send();
      return;
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response.status(HttpStatus.NOT_FOUND).json(error.message).send();
        return;
      }
    }
  }
  /* 
  @Public()
  @Get('turnos/:idTurno')
  async findOneTurno(@Res() response: Response, @Param('idTurno') id: string) {
    try {
      const clase = await this.claseService.findOneTurno(id);
      response.status(200).json(new ClaseDto(clase)).send();
      return;
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response.status(HttpStatus.NOT_FOUND).json(error.message).send();
        return;
      }
    }
  } */

  @Public()
  @Get('turnos/:idAlumno')
  async findByAlumno(@Res() response: Response, @Param('idAlumno') id: string) {
    try {
      const clases = await this.claseService.findByAlumno(id);
      response
        .status(200)
        .json(clases.map((clase) => new ClaseDto(clase)))
        .send();
      return;
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response.status(HttpStatus.NOT_FOUND).json(error.message).send();
        return;
      }
    }
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
        ubicacion: updateClaseDto.ubicacion,
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
      return;
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
      } else {
        response.json(error).send();
        return;
      }
    }
  }

  @Roles(Role.Docente)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Res() response: Response, @Param('id') id: string) {
    try {
      await this.claseService.remove(id);
      response.status(HttpStatus.NO_CONTENT).send();
      return;
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
      } else {
        response.json(error).send();
        return;
      }
    }
  }

  @Roles(Role.Alumno)
  @UseGuards(RolesGuard)
  @Post(':id/turnos/:idTurno')
  async apuntarAlumno(
    @Res() response: Response,
    @Param('id') idClase: string,
    @Param('idTurno') idTurno: string,
    @Body() apuntarDto: ApuntarDto,
  ) {
    try {
      const clase = await this.claseService.apuntarAlumno(
        idClase,
        idTurno,
        apuntarDto.idAlumno,
        apuntarDto.apuntarse,
      );
      response.status(200).json(new ClaseDto(clase)).send();
      return;
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
        return;
      } else if (error instanceof ErrorFormanderaBadRequest) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(new BadRequestException(error.message))
          .send();
        return;
      } else {
        response.json(error).send();
        return;
      }
    }
  }

  @Roles(Role.Docente)
  @UseGuards(RolesGuard)
  @Patch(':id/turnos/:idTurno')
  async modificarTurno(
    @Res() response: Response,
    @Param('id') idClase: string,
    @Param('idTurno') idTurno: string,
    @Body() updateTurnoDto: UpdateTurnoDto,
  ) {
    try {
      const turno = new Turno({
        idPublico: idTurno,
        dia: updateTurnoDto.dia,
        asignatura: updateTurnoDto.asignatura,
        horaInicio: updateTurnoDto.horaInicio,
        horaFin: updateTurnoDto.horaFin,
        alumnosMax: updateTurnoDto.alumnosMax,
        idAlumnos: updateTurnoDto.idAlumnos,
      });
      const nuevoTurno = await this.claseService.modificarTurno(idClase, turno);
      response.status(200).json(new TurnoDto(nuevoTurno)).send();
      return;
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
        return;
      } else if (error instanceof ErrorFormanderaBadRequest) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(new BadRequestException(error.message))
          .send();
        return;
      } else {
        response.json(error).send();
        return;
      }
    }
  }

  @Roles(Role.Docente)
  @UseGuards(RolesGuard)
  @Put(':id/turnos')
  async nuevoTurno(
    @Res() response: Response,
    @Param('id') idClase: string,
    @Body() createTurnoDto: CreateTurnoDto,
  ) {
    try {
      const turno = new Turno({
        idPublico: uuidv4(),
        dia: createTurnoDto.dia,
        asignatura: createTurnoDto.asignatura,
        horaInicio: createTurnoDto.horaInicio,
        horaFin: createTurnoDto.horaFin,
        alumnosMax: createTurnoDto.alumnosMax,
        idAlumnos: [],
      });
      const nuevoTurno = await this.claseService.nuevoTurno(idClase, turno);
      response.status(201).json(new ClaseDto(nuevoTurno)).send();
      return;
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
        return;
      } else if (error instanceof ErrorFormanderaBadRequest) {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(new BadRequestException(error.message))
          .send();
        return;
      } else {
        response.json(error).send();
        return;
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
      return;
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
        return;
      } else if (error instanceof ErrorFormanderaBadRequest) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new BadRequestException(error.message))
          .send();
        return;
      } else {
        response.json(error).send();
        return;
      }
    }
  }

  @Roles(Role.Docente)
  @UseGuards(RolesGuard)
  @Patch(':id/turnos/:idTurno/alumnos/:idAlumno')
  async expulsarAlumno(
    @Request() req,
    @Res() response: Response,
    @Param('id') idClase: string,
    @Param('idTurno') idTurno: string,
    @Param('idAlumno') idAlumno: string,
  ) {
    try {
      console.log(idClase, idTurno, idAlumno);
      const claseDB = await this.claseService.findOne(idClase);
      //Comparación del id del usuario logueado con el id del autor del comentario.
      if (req.user.idPublico !== claseDB.idProfesor)
        throw new ErrorFormanderaUnauthorized(
          'No eres el usuario autor de esta cuenta',
        );

      const clase = await this.claseService.expulsarAlumno(
        idClase,
        idTurno,
        idAlumno,
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
          .status(HttpStatus.BAD_REQUEST)
          .json(new BadRequestException(error.message))
          .send();
      } else {
        response.json(error).send();
      }
    }
  }
}
