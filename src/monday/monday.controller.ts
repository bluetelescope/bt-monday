import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import getVariables from 'src/functions/getVariables';
import getItemInfo from 'src/functions/getItemInfo';
// import * as process from 'process';
import axios from 'axios';

const TEMPLATE_BOARD = 6198096739;
const PIPELINE_BOARD = 5552219681;
const TIMETRACKING_BOARD = 5872168554;
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
            'query {\n  items(limit: 1, ids: [5104037469]) {\n    column_values {\n      value\n      column {\n        title\n      }\n    }\n    name\n    subscribers {\n      id\n      \n    }\n  }\n}',
        });

        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'https://api.monday.com/v2',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MONDAY_AUTH}`,
            Cookie:
              '__cf_bm=m8zc61.IT0xf6oKWKbBo0QWuPhgxPFUC1dW87JwdnpE-1723044832-1.0.1.1-jUOMtZtUcNVOa.AdRWzi6gzMAurMpB6iDfAZol1F8eKTorhtD5fLHGey_bZSPocyVGvoqr2OMshqhyFugxndrzYrXfWvJml80MJlgJOvxY8',
          },
          data: graphql,
        };

        console.log(
          'config*************************************************************************',
          config,
        );
        axios
          .request(config)
          .then((response) => {
            console.log('*********************************response');
            console.log('response', response);
            console.log('response.data', response.data);

            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log('*********************************response');

            console.log(error);
          });
        //event info has information regarding only the value of this particular column information
        //make a get request: get all information regarding this item
      } else {
        //if there is not an event field on the body
        //it's the verification request
        console.log('no event:', data);

        // body is parsed by NestJS
      }
    }
  }
}
