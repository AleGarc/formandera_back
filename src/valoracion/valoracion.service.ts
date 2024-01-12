import { Inject, Injectable } from '@nestjs/common';
import { Comentario, Valoracion } from './entities/valoracion.entity';
import { ValoracionRepository } from './valoracion.repository';
import { ErrorFormanderaNotFound } from 'src/base/error';

@Injectable()
export class ValoracionService {
  constructor(
    @Inject(ValoracionRepository)
    private valoracionRepository: ValoracionRepository,
  ) {}

  //Método utilizado por el servicio de clase.
  //El identificador de la valoración será el mismo
  //que el de la clase.
  async create(idClase: string) {
    const nuevaValoracion = new Valoracion({
      idPublico: idClase,
      puntuacion: 0,
      comentarios: [],
      metadatos: {
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedBy: '',
        updatedAt: '',
      },
    });
    return await this.valoracionRepository.create(nuevaValoracion);
  }

  async findOne(id: string) {
    return await this.valoracionRepository.get(id);
  }

  async findByAutor(id: string, idAutor: string) {
    const valoracion = await this.valoracionRepository.get(id);
    const comentario = valoracion.comentarios.find(
      (comentario) => comentario.idAutor === idAutor,
    );
    if (comentario === undefined)
      throw new ErrorFormanderaNotFound(
        `No existe ningún comentario con idAutor ${idAutor}`,
      );
    return comentario;
  }

  async agregarComentario(
    id: string,
    comentario: Comentario,
  ): Promise<Valoracion> {
    const valoracion = await this.valoracionRepository.get(id);
    valoracion.agregarComentario(comentario);
    return await this.valoracionRepository.update(id, valoracion);
  }

  async modificarComentario(
    id: string,
    comentario: Comentario,
  ): Promise<Valoracion> {
    const valoracion = await this.valoracionRepository.get(id);
    valoracion.modificarComentario(comentario);
    return await this.valoracionRepository.update(id, valoracion);
  }

  async eliminarComentario(id: string, idAutor: string): Promise<Valoracion> {
    const valoracion = await this.valoracionRepository.get(id);
    valoracion.eliminarComentario(idAutor);
    return await this.valoracionRepository.update(id, valoracion);
  }

  //Utilizado por el servicio de clase
  async remove(id: string): Promise<Valoracion> {
    return await this.valoracionRepository.delete(id);
  }
}
