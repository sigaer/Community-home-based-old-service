import { Test, TestingModule } from '@nestjs/testing';
import { AgencyGateway } from './agency.gateway';
import { AgencyService } from './agency.service';

describe('AgencyGateway', () => {
  let gateway: AgencyGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgencyGateway, AgencyService],
    }).compile();

    gateway = module.get<AgencyGateway>(AgencyGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
