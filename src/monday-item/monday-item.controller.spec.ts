import { Test, TestingModule } from '@nestjs/testing';
import { MondayItemController } from './monday-item.controller';
import { MondayItemService } from './monday-item.service';

describe('MondayItemController', () => {
  let controller: MondayItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MondayItemController],
      providers: [MondayItemService],
    }).compile();

    controller = module.get<MondayItemController>(MondayItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
