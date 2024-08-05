import { Test, TestingModule } from '@nestjs/testing';
import { MondayItemService } from './monday-item.service';

describe('MondayItemService', () => {
  let service: MondayItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MondayItemService],
    }).compile();

    service = module.get<MondayItemService>(MondayItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
