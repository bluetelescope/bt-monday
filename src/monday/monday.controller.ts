import { Controller, Post, Get, Param, Query, Body } from '@nestjs/common';
import { RawBodyRequest, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';

import { ValidateMondayDto } from './dto/validate-monday.dto';
// import { PostStatusToWonDto } from './dto/status-won.dto';
// import { PostTestDto } from './dto/post-test.dto';

import { MondayService } from './monday.service';

@Controller('monday')
export class MondayController {
  @Get()
  getMonday() {
    return {};
  }

  @Get(':id')
  getMondayID(@Param('id') id: string) {
    return { id };
  }

  // POST validate
  @Post()
  async index(@Body() data, @Req() req) {
    // we have to check req.readable because of raw-body issue #57
    // https://github.com/stream-utils/raw-body/issues/57
    if (req.readable) {
      // body is ignored by NestJS -> get raw body from request
      const raw = await rawbody(req);
      const text = raw.toString().trim();
      console.log('body:', text);
    } else {
      // body is parsed by NestJS
      console.log('data:', data);
    }

    // ...
  }
  // create(@Req() req: RawBodyRequest<Request>) {
  //   const raw = req.rawBody; // returns a `Buffer`.
  // }
  // postValidateMonday(@Body() validateMonday: ValidateMondayDto) {
  //   const service = new MondayService();
  //   return service.postMonday(validateMonday.challenge);
  // }
}

// @Controller('monday')
// export class MondayController {

//   @Get()
//   getMonday() {
//     return {};
//   }
//   @Get(':id')
//   getMondayID(@Param('id') id: string) {
//     return { id };
//   }
//   POST validate
//   @Post()
//   postValidateMonday(@Body() validateMonday: ValidateMondayDto) {
//     const service = new MondayService();
//     return service.postValidateMonday(validateMonday.challenge);
//   }

//   // POST status to won
//   @Post()
//   postStatusToWon(@Body() postStatusToWonDto: PostStatusToWonDto) {
//     const service = new MondayService();
//     return service.postStatusToWon(postStatusToWonDto);
//   }
//   @Post()
//   postTest() {
//     return 'i recived your post';
//   }

//   @Post()
//   postStatusToWon(@Body() data: any) {
//     const service = new MondayService();
//     return service.postStatusToWon();
//   }
// }
