import { Test, TestingModule } from '@nestjs/testing';
import { ValoracionController } from './valoracion.controller';
import { ValoracionService } from './valoracion.service';

describe('ValoracionController', () => {
  let controller: ValoracionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValoracionController],
      providers: [ValoracionService],
    }).compile();

    controller = module.get<ValoracionController>(ValoracionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
