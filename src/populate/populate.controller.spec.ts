import { Test, TestingModule } from '@nestjs/testing';
import { PopulateController } from './populate.controller';

describe('PopulateController', () => {
  let controller: PopulateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PopulateController],
    }).compile();

    controller = module.get<PopulateController>(PopulateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
