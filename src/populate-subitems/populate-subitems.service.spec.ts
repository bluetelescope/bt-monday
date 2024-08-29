import { Test, TestingModule } from '@nestjs/testing';
import { PopulateSubitemsService } from './populate-subitems.service';

describe('PopulateSubitemsService', () => {
  let service: PopulateSubitemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PopulateSubitemsService],
    }).compile();

    service = module.get<PopulateSubitemsService>(PopulateSubitemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
