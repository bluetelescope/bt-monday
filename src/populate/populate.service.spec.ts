import { Test, TestingModule } from '@nestjs/testing';
import { PopulateService } from './populate.service';

describe('PopulateService', () => {
  let service: PopulateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PopulateService],
    }).compile();

    service = module.get<PopulateService>(PopulateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
