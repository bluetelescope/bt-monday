import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';

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
      //if there is an event field on the body
      if (!!data.event) {
        console.log('data:', data);
        const graphql = JSON.stringify({
          query:
            'mutation{\n create_board(  \ntemplate_id: 6198096739\n  board_name: "Testing"\ndescription: "board created as test for automation"\nboard_kind: public\nfolder_id: 7860571\nworkspace_id: 1080416\nboard_owner_ids: [37385671]\nboard_owner_team_ids: [614284]\nboard_subscriber_ids: [37385671]\nboard_subscriber_teams_ids: [614284]\nempty: false\n){id}\n\n}',
          variables: {},
        });

        return graphql;

        //send post request to monday
      } else {
        //if there is not an event field on the body
        //it's the verification request
        console.log('no event:', data);
        const requestBody = JSON.stringify({
          challenge: `${data.challenge}`,
        });
        return requestBody;
      }
      // body is parsed by NestJS
    }
  }
}

// create(@Req() req: RawBodyRequest<Request>) {
//   const raw = req.rawBody; // returns a `Buffer`.
// }
// postValidateMonday(@Body() validateMonday: ValidateMondayDto) {
//   const service = new MondayService();
//   return service.postMonday(validateMonday.challenge);
// }

// import { ValidateMondayDto } from './dto/validate-monday.dto';
// import { MondayService } from './monday.service';
// import { PostStatusToWonDto } from './dto/status-won.dto';
// import { PostTestDto } from './dto/post-test.dto';

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
