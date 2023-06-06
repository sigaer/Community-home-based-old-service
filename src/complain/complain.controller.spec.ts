import { Test, TestingModule } from '@nestjs/testing';
import { ComplainController } from './complain.controller';
import { ComplainService } from './complain.service';

describe('ComplainController', () => {
  let controller: ComplainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplainController],
      providers: [ComplainService],
    }).compile();

    controller = module.get<ComplainController>(ComplainController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
