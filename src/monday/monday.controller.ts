import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
// import * as process from 'process';
import axios from 'axios';

const TEMPLATEBOARD_ID = 6198096739;
const PIPELINEBOARD_ID = 5552219681;
const PROD_WORKSPACE = 1080416;
const BIZDEV_WORKSPACE = 3839751;

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
        const axios = require('axios');

        const graphql = JSON.stringify({
          query:
            'mutation{\n create_board(  \ntemplate_id: 6198096739\n  board_name: "Testing"\ndescription: "board created as test for automation"\nboard_kind: public\nfolder_id: 7860571\nworkspace_id: 1080416\nboard_owner_ids: [37385671]\nboard_owner_team_ids: [614284]\nboard_subscriber_ids: [37385671]\nboard_subscriber_teams_ids: [614284]\nempty: false\n){id}\n\n}',
        });
        let jsonData = JSON.stringify({
          query: `mutation{
         create_board(  
        template_id: 6198096739
          board_name: "Testing"
        description: "board created as test for automation"
        board_kind: public
        folder_id: 7860571
        workspace_id: 1080416
        board_owner_ids: [37385671]
        board_owner_team_ids: [614284]
        board_subscriber_ids: [37385671]
        board_subscriber_teams_ids: [614284]
        empty: false
        ){id}
        
        }`,
          variables: {},
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://api.monday.com/v2',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MONDAY_AUTH}`,
            Cookie:
              '__cf_bm=m8zc61.IT0xf6oKWKbBo0QWuPhgxPFUC1dW87JwdnpE-1723044832-1.0.1.1-jUOMtZtUcNVOa.AdRWzi6gzMAurMpB6iDfAZol1F8eKTorhtD5fLHGey_bZSPocyVGvoqr2OMshqhyFugxndrzYrXfWvJml80MJlgJOvxY8',
          },
          data: jsonData,
        };

        console.log(
          'config*************************************************************************',
          config,
        );
        axios
          .request(config)
          .then((response) => {
            console.log('*********************************response');
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log('*********************************response');

            console.log(error);
          });
      } else {
        //if there is not an event field on the body
        //it's the verification request
        console.log('no event:', data);

        // body is parsed by NestJS
      }
    }
  }
}
