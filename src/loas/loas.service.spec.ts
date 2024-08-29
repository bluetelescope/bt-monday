import { Test, TestingModule } from '@nestjs/testing';
import { LOASService } from './loas.service';

describe('LOASService', () => {
  let service: LOASService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LOASService],
    }).compile();

    service = module.get<LOASService>(LOASService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
