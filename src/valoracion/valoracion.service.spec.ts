import { Test, TestingModule } from '@nestjs/testing';
import { ValoracionService } from './valoracion.service';

describe('ValoracionService', () => {
  let service: ValoracionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValoracionService],
    }).compile();

    service = module.get<ValoracionService>(ValoracionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
