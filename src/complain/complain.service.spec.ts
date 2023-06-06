import { Test, TestingModule } from '@nestjs/testing';
import { ComplainService } from './complain.service';

describe('ComplainService', () => {
  let service: ComplainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplainService],
    }).compile();

    service = module.get<ComplainService>(ComplainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
