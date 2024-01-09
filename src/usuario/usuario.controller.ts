import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  NotFoundException,
  Res,
  ConflictException,
  Request,
  Query,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Public } from 'src/auth/public.decorator';
import {
  Alumno,
  Docente,
  Usuario,
  crearUsuario,
} from './entities/usuario.entity';
import { v4 as uuidv4 } from 'uuid';
import { UsuarioDto } from './dto/usuario.dto';
import { Response } from 'express';
import {
  ErrorFormanderaConflict,
  ErrorFormanderaNotFound,
  ErrorFormanderaUnauthorized,
} from 'src/base/error';
import { QueryStringDto } from './dto/query-string.dto';
import { QueryEntidad } from './entities/query.entity';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Public()
  @Post()
  async create(
    @Res() response: Response,
    @Body() createUsuarioDto: CreateUsuarioDto,
  ) {
    const idPublico = uuidv4();
    const nuevoUsuario = crearUsuario(idPublico, createUsuarioDto);
    try {
      const usuarioCreado = await this.usuarioService.create(nuevoUsuario);
      response.status(HttpStatus.CREATED).json(usuarioCreado.idPublico).send();
      return;
    } catch (ErrorFormanderaConflict) {
      response
        .status(HttpStatus.CONFLICT)
        .json(new ConflictException(ErrorFormanderaConflict.message))
        .send();
      return;
    }
  }

  @Public()
  @Get()
  async findAll(@Query() queryStringDto: QueryStringDto) {
    if (Object.keys(queryStringDto).length === 0)
      return {
        data: (await this.usuarioService.findAll()).map(
          (usuario) => new UsuarioDto(usuario),
        ),
      };
    const queryEntidad: QueryEntidad = new QueryEntidad(queryStringDto);
    return {
      data: (await this.usuarioService.findByQuery(queryEntidad)).map(
        (usuario) => new UsuarioDto(usuario),
      ),
      pagination: { take: queryEntidad.take, skip: queryEntidad.skip },
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Res() response: Response, @Param('id') id: string) {
    try {
      const usuario = await this.usuarioService.findOne(id);
      response.status(HttpStatus.OK).json(new UsuarioDto(usuario)).send();
      return;
    } catch (ErrorFormanderaNotFound) {
      response.status(HttpStatus.NOT_FOUND).send();
      return;
    }
  }

  @Public()
  @Get('/email/:email')
  async findOneByEmail(
    @Res() response: Response,
    @Param('email') email: string,
  ) {
    try {
      await this.usuarioService.findByEmail(email);
      response.status(HttpStatus.OK).send();
      return;
    } catch (ErrorFormanderaNotFound) {
      response.status(HttpStatus.NOT_FOUND).send();
      return;
    }
  }

  @Public()
  @Get('/username/:username')
  async findOneByUsername(
    @Res() response: Response,
    @Param('username') username: string,
  ) {
    try {
      await this.usuarioService.findByUsername(username);
      response.status(HttpStatus.OK).send();
      return;
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response.status(HttpStatus.NOT_FOUND).json(error.message).send();
        return;
      }
    }
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    try {
      //Comparación del id del usuario logueado con el id del autor del comentario.
      if (req.user.idPublico !== id)
        throw new ErrorFormanderaUnauthorized(
          'No eres el usuario autor de esta cuenta',
        );

      const usuarioAntiguo = await this.usuarioService.findOne(id);

      let usuarioActualizado: Usuario;
      if (usuarioAntiguo instanceof Docente) {
        usuarioActualizado = new Docente({
          _idDB: usuarioAntiguo._idDB,
          idPublico: usuarioAntiguo.idPublico,
          username: updateUsuarioDto.username ?? usuarioAntiguo.username,
          nombre: updateUsuarioDto.nombre ?? usuarioAntiguo.nombre,
          biografia: updateUsuarioDto.biografia ?? usuarioAntiguo.biografia,
          email: updateUsuarioDto.email ?? usuarioAntiguo.email,
          password: updateUsuarioDto.password ?? usuarioAntiguo.password,
          clase: updateUsuarioDto.clase ?? usuarioAntiguo.clase,
          educacion: updateUsuarioDto.educacion ?? usuarioAntiguo.educacion,
          asignaturas:
            updateUsuarioDto.asignaturas ?? usuarioAntiguo.asignaturas,
          experiencia:
            updateUsuarioDto.experiencia ?? usuarioAntiguo.experiencia,
          role: usuarioAntiguo.role,
          comentarios: usuarioAntiguo.comentarios,
          metadatos: usuarioAntiguo.metadatos,
        });
      } else if (usuarioAntiguo instanceof Alumno) {
        usuarioActualizado = new Alumno({
          _idDB: usuarioAntiguo._idDB,
          idPublico: usuarioAntiguo.idPublico,
          username: updateUsuarioDto.username ?? usuarioAntiguo.username,
          nombre: updateUsuarioDto.nombre ?? usuarioAntiguo.nombre,
          biografia: updateUsuarioDto.biografia ?? usuarioAntiguo.biografia,
          email: updateUsuarioDto.email ?? usuarioAntiguo.email,
          password: updateUsuarioDto.password ?? usuarioAntiguo.password,
          curso_academico:
            updateUsuarioDto.curso_academico ?? usuarioAntiguo.curso_academico,
          turnos: updateUsuarioDto.turnos ?? usuarioAntiguo.turnos,
          role: usuarioAntiguo.role,
          comentarios: usuarioAntiguo.comentarios,
          metadatos: usuarioAntiguo.metadatos,
        });
      }
      const usuarioResultado = await this.usuarioService.update(
        id,
        usuarioActualizado,
      );
      response
        .status(HttpStatus.OK)
        .json(new UsuarioDto(usuarioResultado))
        .send();
      return;
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
        return;
      }
      if (error instanceof ErrorFormanderaUnauthorized) {
        response
          .status(HttpStatus.UNAUTHORIZED)
          .json(new ConflictException(error.message))
          .send();
        return;
      }
    }
  }

  @Delete(':id')
  async remove(@Res() response: Response, @Param('id') id: string) {
    try {
      await this.usuarioService.remove(id);
      response.status(HttpStatus.NO_CONTENT).send();
      return;
    } catch (ErrorFormanderaNotFound) {
      response
        .status(HttpStatus.NOT_FOUND)
        .json(new NotFoundException(ErrorFormanderaNotFound.message))
        .send();
      return;
    }
  }

  @Post(':id/comentarios')
  async agregarComentario(
    @Request() req,
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    try {
      if (req.user.idPublico !== id)
        throw new ErrorFormanderaUnauthorized(
          'No eres el usuario autor de esta cuenta',
        );

      const idComentario = updateUsuarioDto.idComentario;
      await this.usuarioService.agregarComentario(id, idComentario);
      response.status(HttpStatus.OK).send();
      return;
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
        return;
      } else if (error instanceof ErrorFormanderaConflict) {
        response
          .status(HttpStatus.CONFLICT)
          .json(new ConflictException(error.message))
          .send();
        return;
      } else if (error instanceof ErrorFormanderaUnauthorized) {
        response
          .status(HttpStatus.UNAUTHORIZED)
          .json(new ConflictException(error.message))
          .send();
        return;
      }
    }
  }

  @Delete(':id/comentarios/:idComentario')
  async borrarComentario(
    @Request() req,
    @Res() response: Response,
    @Param('id') id: string,
    @Param('idComentario') idComentario: string,
  ) {
    try {
      if (req.user.idPublico !== id)
        throw new ErrorFormanderaUnauthorized(
          'No eres el usuario autor de esta cuenta',
        );

      await this.usuarioService.borrarComentario(id, idComentario);
      response.status(HttpStatus.NO_CONTENT).send();
      return;
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
        return;
      } else if (error instanceof ErrorFormanderaUnauthorized) {
        response
          .status(HttpStatus.UNAUTHORIZED)
          .json(new ConflictException(error.message))
          .send();
        return;
      }
    }
  }
}
