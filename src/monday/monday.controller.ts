import { Controller, Post, Get, Param, Query, Body } from '@nestjs/common';
import { ValidateMondayDto } from './dto/validate-monday.dto';
import { PostStatusToWonDto } from './dto/status-won.dto';

import { MondayService } from './monday.service';

@Controller('monday')
export class MondayController {
  //POST /validate
  //POST /monday

  @Get()
  getMonday() {
    return {};
  }
  @Get(':id')
  getMondayID(@Param('id') id: string) {
    return { id };
  }
  //   POST validate
  @Post()
  postValidateMonday(@Body() validateMonday: ValidateMondayDto) {
    const service = new MondayService();
    return service.postValidateMonday(validateMonday.challenge);
  }
  // POST status to won
  @Post()
  postStatusToWon(@Body() postStatusToWonDto: PostStatusToWonDto) {
    const service = new MondayService();
    return service.postStatusToWon(postStatusToWonDto);

    // test creation of item in board in different workspace??
  }
}
