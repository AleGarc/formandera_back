import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpStatus,
  Res,
  ConflictException,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ValoracionService } from './valoracion.service';
import { Response } from 'express';
import { ValoracionDto } from './dto/valoracion.dto';
import { Public } from 'src/auth/public.decorator';
import { CreateComentarioDto } from './dto/create-valoracion.dto';
import { Comentario } from './entities/valoracion.entity';
import { UpdateComentarioDto } from './dto/update-valoracion.dto';
import {
  ErrorFormanderaConflict,
  ErrorFormanderaNotFound,
  ErrorFormanderaUnauthorized,
} from 'src/base/error';

@Controller('valoracion')
export class ValoracionController {
  constructor(private readonly valoracionService: ValoracionService) {}

  @Public()
  @Get(':id')
  async findOne(@Res() response: Response, @Param('id') id: string) {
    try {
      const valoracion = await this.valoracionService.findOne(id);
      response.status(HttpStatus.OK).json(new ValoracionDto(valoracion)).send();
    } catch (ErrorFormanderaNotFound) {
      response
        .status(HttpStatus.NOT_FOUND)
        .json(new NotFoundException(ErrorFormanderaNotFound))
        .send();
    }
  }

  //Se ha optado por identificar a los comentarios por el mismo
  //id que el usuario autor del mismo.
  @Post(':id/comentarios')
  async agregarComentario(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() createComentarioDto: CreateComentarioDto,
  ) {
    try {
      const nuevoComentario = new Comentario(createComentarioDto);
      const valoracion = await this.valoracionService.agregarComentario(
        id,
        nuevoComentario,
      );
      response.status(HttpStatus.OK).json(new ValoracionDto(valoracion)).send();
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
      } else if (error instanceof ErrorFormanderaConflict) {
        response
          .status(HttpStatus.CONFLICT)
          .json(new ConflictException(error.message))
          .send();
      }
    }
  }

  //Se construye el comentario modificado a partir del comentario existente
  //y el comentario recibido en el body.
  @Patch(':id/comentarios/:idAutor')
  async modificarComentario(
    @Request() req,
    @Res() response: Response,
    @Param('id') id: string,
    @Param('idAutor') _idAutor: string,
    @Body() updateComentarioDto: UpdateComentarioDto,
  ) {
    try {
      //Comparación del id del usuario logueado con el id del autor del comentario.
      if (req.user.idPublico !== _idAutor)
        throw new ErrorFormanderaUnauthorized(
          'No eres el autor de ese comentario',
        );

      //Recuperación de la valoración y comprobación de que existe el comentario
      //con mismo autor.
      const valoracionAntigua = await this.valoracionService.findOne(id);
      const comentarioAntiguo = valoracionAntigua.comentarios.find(
        (comentario) => comentario.idAutor === _idAutor,
      );
      if (comentarioAntiguo === undefined)
        throw new ErrorFormanderaNotFound(
          'No existe un comentario del usuario con id ' + _idAutor,
        );

      //Construcción del comentario modificado a partir del comentario existente
      const comentario = new Comentario({
        idAutor: comentarioAntiguo.idAutor,
        nombreAutor:
          updateComentarioDto.nombreAutor ?? comentarioAntiguo.nombreAutor,
        calificacion:
          updateComentarioDto.calificacion ?? comentarioAntiguo.calificacion,
        mensaje: updateComentarioDto.mensaje ?? comentarioAntiguo.mensaje,
      });

      //Modificación del comentario y persistencia.
      const valoracion = await this.valoracionService.modificarComentario(
        id,
        comentario,
      );

      response.status(HttpStatus.OK).json(new ValoracionDto(valoracion)).send();
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
      } else if (error instanceof ErrorFormanderaUnauthorized) {
        response
          .status(HttpStatus.UNAUTHORIZED)
          .json(new UnauthorizedException(error.message))
          .send();
      }
    }
  }

  @Delete(':id/comentarios/:idAutor')
  async eliminarComentario(
    @Request() req,
    @Res() response: Response,
    @Param('id') id: string,
    @Param('idAutor') _idAutor: string,
  ) {
    try {
      //Comparación del id del usuario logueado con el id del autor del comentario.
      if (req.user.idPublico !== _idAutor)
        throw new ErrorFormanderaUnauthorized(
          'No eres el autor de ese comentario',
        );

      const valoracion = await this.valoracionService.eliminarComentario(
        id,
        _idAutor,
      );

      //Se ha optado por devolver la valoración completa una vez
      //eliminado el comentario para que el cliente pueda refrescar el estado.
      response.status(HttpStatus.OK).json(new ValoracionDto(valoracion)).send();
    } catch (error) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
      } else if (error instanceof ErrorFormanderaUnauthorized) {
        response
          .status(HttpStatus.UNAUTHORIZED)
          .json(new UnauthorizedException(error.message))
          .send();
      }
    }
  }
}
