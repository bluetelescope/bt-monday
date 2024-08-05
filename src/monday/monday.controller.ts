import { Controller, Post, Get, Param, Query, Body } from '@nestjs/common';
import { ValidateMondayDto } from './dto/validate-monday.dto';

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
  postMonday(@Body() validateMonday: ValidateMondayDto) {
    return { challenge: validateMonday.challenge };
  }
  // POST event

  //   @Get(':challenge')
  //   postValidate(@Query('challenge') challenge: string) {
  //     return [{ challenge }];
  //   }
}
