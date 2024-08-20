import { Test, TestingModule } from '@nestjs/testing';
import { CostUpdateService } from './cost-update.service';

describe('CostUpdateService', () => {
  let service: CostUpdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostUpdateService],
    }).compile();

    service = module.get<CostUpdateService>(CostUpdateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
