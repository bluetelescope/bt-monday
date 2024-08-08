import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import {
  returnGetBoardsConfig,
  returnGetUsersConfig,
  returnGetItemConfig,
  returnPostBoardConfig,
} from 'src/functions/returnConfig';
import {
  returnPostBoardQuery,
  returnGetUsersQuery,
  returnGetItemQuery,
  returnGetBoardsQuery,
} from 'src/functions/returnQuery';

import getVariables from 'src/functions/getVariables';
import getItemInfo from 'src/functions/getItemInfo';
// import * as process from 'process';
import axios from 'axios';

const TEMPLATE_BOARD = 6198096739;
const PIPELINE_BOARD = 5552219681;
const TIMETRACKING_BOARD = 5872168554;
const PROD_WORKSPACE = 1080416;
const BIZDEV_WORKSPACE = 3839751;
const MIDLEVEL_FOLDER = 14770065;
const ACTIVE_FOLDER = 7860571;
const testItemID = 5104037469;

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
        //TODO: get item id (pulse_id) from event data
        const axios = require('axios');
        const graphqlGetItem = returnGetItemQuery(testItemID);
        let configGetItem = returnGetItemConfig(graphqlGetItem);
        const graphqlGetBoards = returnGetBoardsQuery(PROD_WORKSPACE);
        let configGetBoards = returnGetBoardsConfig(graphqlGetBoards);
        const graphqlGetUsers = returnGetUsersQuery();
        let configGetUsers = returnGetUsersConfig(graphqlGetUsers);

        let itemName = ''; //Hadley_Colored Musicians Club
        let subscribers = []; //[ { id: '23774585' }, { id: '26473580' } ]
        let columns = [];
        let proposal;
        let estRevenue;
        let forecastValue;
        let actualProjectValue;
        let costOfProd;
        let files = '';
        let gDrive = '';
        let team = [];
        let boards = [];

        let columnValues = [
          { proposal: '' },
          { estRevenue: '' },
          { forecastValue: '' },
          { actualProjectValue: '' },
        ];
        console.log('configGetItem:', configGetItem);
        console.log('configGetBoards:', configGetBoards);
        console.log('configGetUsers:', configGetUsers);

        Promise.all([
          axios.get(configGetItem),
          axios.get(configGetBoards),
          axios.get(configGetUsers),
        ])
          .then((response) => {
            console.log(
              'response Promise.all ***************************************************',
            );
            const [response1, response2, response3] = response;

            console.log(
              'response1 ***************************************************',
              response1,
            );
            console.log(
              'response2 ***************************************************',
              response2,
            );
            console.log(
              'response3 ***************************************************',
              response3,
            );

            // const responseData = response.data.data.items[0];
            // itemName = responseData.name;
            // //Hadley_Colored Musicians Club
            // subscribers = responseData.subscribers;
            // //[ { id: '23774585' }, { id: '26473580' } ]
            // columns = responseData.column_values;
            // proposal = columns.filter((column) => {
            //   return column.column.title.includes('Proposal');
            // })[0].value;
            // estRevenue = columns.filter((column) => {
            //   return column.column.title.includes('Est Revenue');
            // })[0].value;
            // forecastValue = columns.filter((column) => {
            //   return column.column.title.includes('Forecast Value');
            // })[0].value;
            // actualProjectValue = columns.filter((column) => {
            //   return column.column.title.includes('Project Value');
            // })[0].value;
            // costOfProd = columns.filter((column) => {
            //   return column.column.title.includes('Cost of Production');
            // })[0].value;
            // files = columns.filter((column) => {
            //   return column.column.title.includes('Files');
            // })[0].value;
            // gDrive = columns.filter((column) => {
            //   return column.column.title.includes('(G-Drive)');
            // })[0].value;

            // const graphqlPostBoard = returnPostBoardQuery(
            //   TEMPLATE_BOARD,
            //   itemName,
            //   ACTIVE_FOLDER,
            //   PROD_WORKSPACE,
            // );
            // let configPostBoard = returnPostBoardConfig(graphqlPostBoard);

            // // //make post request with data that has been put into variables above
            // return axios.request(configPostBoard);
          })
          // .then((response) => {
          //   console.log(
          //     '*********************************response to post 1',
          //     response,
          //   );
          //   console.log(
          //     '*********************************response.data to post 1',
          //     response.data,
          //   );
          // })
          .catch((error) => {
            console.log(
              'error ***************************************************************',
            );
            console.log(error.response);
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
