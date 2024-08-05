import { Test, TestingModule } from '@nestjs/testing';
import { MondayController } from './monday.controller';

describe('MondayController', () => {
  let controller: MondayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MondayController],
    }).compile();

    controller = module.get<MondayController>(MondayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
