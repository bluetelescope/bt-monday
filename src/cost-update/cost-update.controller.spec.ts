import { Test, TestingModule } from '@nestjs/testing';
import { CostUpdateController } from './cost-update.controller';

describe('CostUpdateController', () => {
  let controller: CostUpdateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CostUpdateController],
    }).compile();

    controller = module.get<CostUpdateController>(CostUpdateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
