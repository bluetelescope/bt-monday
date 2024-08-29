import { Test, TestingModule } from '@nestjs/testing';
import { LOASController } from './loas.controller';

describe('LOASController', () => {
  let controller: LOASController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LOASController],
    }).compile();

    controller = module.get<LOASController>(LOASController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
