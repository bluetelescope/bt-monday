import { Test, TestingModule } from '@nestjs/testing';
import { PopulateSubitemsController } from './populate-subitems.controller';

describe('PopulateSubitemsController', () => {
  let controller: PopulateSubitemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PopulateSubitemsController],
    }).compile();

    controller = module.get<PopulateSubitemsController>(
      PopulateSubitemsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
