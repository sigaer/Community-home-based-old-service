import { Test, TestingModule } from '@nestjs/testing';
import { AnnoController } from './anno.controller';
import { AnnoService } from './anno.service';

describe('AnnoController', () => {
  let controller: AnnoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnoController],
      providers: [AnnoService],
    }).compile();

    controller = module.get<AnnoController>(AnnoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
