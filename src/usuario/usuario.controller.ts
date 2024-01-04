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
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Public } from 'src/auth/public.decorator';
import {
  Usuario,
  UsuarioUpdate,
  crearUsuario,
} from './entities/usuario.entity';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { UsuarioDto } from './dto/usuario.dto';
import { Response } from 'express';

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
  async findOne(@Param('id') id: string) {
    const usuario = await this.usuarioService.findOne(id);
    return new UsuarioDto(usuario);
  }

  @Public()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const updateUsuario = plainToClass(UsuarioUpdate, updateUsuarioDto);
    const usuarioAntiguo = await this.usuarioService.findOne(id);
    console.log(usuarioAntiguo);
    const usuarioActualizado = new Usuario({
      _idDB: usuarioAntiguo._idDB,
      idPublico: usuarioAntiguo.idPublico,
      username: updateUsuario.username || usuarioAntiguo.username,
      nombre: updateUsuario.nombre || usuarioAntiguo.nombre,
      biografia: updateUsuario.biografia || usuarioAntiguo.biografia,
      email: updateUsuario.email || usuarioAntiguo.email,
      password: updateUsuario.password || usuarioAntiguo.password,
      role: usuarioAntiguo.role,
      metadatos: usuarioAntiguo.metadatos,
    });
    const usuarioResultado = await this.usuarioService.update(
      id,
      usuarioActualizado,
    );
    return new UsuarioDto(usuarioResultado);
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
