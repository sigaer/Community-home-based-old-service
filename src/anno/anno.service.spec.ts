import { Test, TestingModule } from '@nestjs/testing';
import { AnnoService } from './anno.service';

describe('AnnoService', () => {
  let service: AnnoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnnoService],
    }).compile();

    service = module.get<AnnoService>(AnnoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
