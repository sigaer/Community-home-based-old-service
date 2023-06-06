import { Test, TestingModule } from '@nestjs/testing';
import { CheckController } from './check.controller';
import { CheckService } from './check.service';

describe('CheckController', () => {
  let controller: CheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckController],
      providers: [CheckService],
    }).compile();

    controller = module.get<CheckController>(CheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
