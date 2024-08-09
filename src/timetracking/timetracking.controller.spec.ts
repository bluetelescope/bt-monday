import { Test, TestingModule } from '@nestjs/testing';
import { TimetrackingController } from './timetracking.controller';

describe('TimetrackingController', () => {
  let controller: TimetrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimetrackingController],
    }).compile();

    controller = module.get<TimetrackingController>(TimetrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
