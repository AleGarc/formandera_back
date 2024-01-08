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
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Public } from 'src/auth/public.decorator';
import { Docente, Usuario, crearUsuario } from './entities/usuario.entity';
import { v4 as uuidv4 } from 'uuid';
import { UsuarioDto } from './dto/usuario.dto';
import { Response } from 'express';
import {
  ErrorFormanderaNotFound,
  ErrorFormanderaUnauthorized,
} from 'src/base/error';

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
    } catch (ErrorFormanderaConflict) {
      response
        .status(HttpStatus.CONFLICT)
        .json(new ConflictException(ErrorFormanderaConflict.message))
        .send();
    }
  }

  @Public()
  @Get()
  async findAll() {
    const usuarios = await this.usuarioService.findAll();
    const resultados = usuarios.map((usuario) => new UsuarioDto(usuario));
    return { data: resultados };
  }

  @Public()
  @Get(':id')
  async findOne(@Res() response: Response, @Param('id') id: string) {
    try {
      const usuario = await this.usuarioService.findOne(id);
      response.status(HttpStatus.OK).json(new UsuarioDto(usuario)).send();
    } catch (ErrorFormanderaNotFound) {
      response.status(HttpStatus.NOT_FOUND).send();
    }
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    //Comparación del id del usuario logueado con el id del autor del comentario.
    if (req.user.idPublico !== id)
      throw new ErrorFormanderaUnauthorized(
        'No eres el usuario autor de esta cuenta',
      );

    try {
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
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
      }
      if (error instanceof ErrorFormanderaUnauthorized) {
        response
          .status(HttpStatus.UNAUTHORIZED)
          .json(new ConflictException(error.message))
          .send();
      }
    }
  }

  @Public()
  @Delete(':id')
  async remove(@Res() response: Response, @Param('id') id: string) {
    try {
      await this.usuarioService.remove(id);
      response.status(HttpStatus.NO_CONTENT).send();
    } catch (ErrorFormanderaNotFound) {
      response
        .status(HttpStatus.NOT_FOUND)
        .json(new NotFoundException(ErrorFormanderaNotFound.message))
        .send();
    }
  }
}
