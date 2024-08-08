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
import {
  parseColumnValues,
  parseBoards,
  parseUsers,
} from 'src/functions/parseData';

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
        // let proposal;
        // let estRevenue;
        // let forecastValue;
        // let actualProjectValue;
        // let costOfProd;
        // let files = '';
        // let gDrive = '';
        // let team = [];
        // let boards = [];

        // const graphqlPostBoard = returnPostBoardQuery(
        //   TEMPLATE_BOARD,
        //   itemName,
        //   ACTIVE_FOLDER,
        //   PROD_WORKSPACE,
        // );
        // let configPostBoard = returnPostBoardConfig(graphqlPostBoard);

        let columnValues = [
          { name: 'proposal', string: 'Proposal', value: '' },
          { name: 'estRevenue', string: 'Est Revenue', value: '' },
          { name: 'forecastValue', string: 'Forecast Value', value: '' },
          { name: 'actualProjectValue', string: 'Project Value', value: '' },
          { name: 'costOfProd', string: 'Cost of Production', value: '' },
          { name: 'files', string: 'Files', value: '' },
          { name: 'gDrive', string: '(G-Drive)', value: '' },
          { name: 'boards', string: 'Project Value', value: '' },
        ];

        axios
          .request(configGetItem)
          .then((responseConfigGetItem) => {
            console.log(
              'responseConfigGetItem *********************************',
            );
            const item = responseConfigGetItem.data.data.items[0];
            console.log('item', item);
            itemName = item.name.replace('_', ''); //Hadley_Colored Musicians Club
            subscribers = item.subscribers; //[ { id: '23774585' }, { id: '26473580' } ]
            columns = item.column_values;
            //TODO: function that parses columns
            const columnData = parseColumnValues(item.column_values);
            console.log('columnData', columnData);
            return axios.request(configGetBoards);
          })
          .then((responseConfigGetBoards) => {
            console.log(
              'responseConfigGetBoards *********************************',
              // responseConfigGetBoards,
            );

            const boards = responseConfigGetBoards.data.data.boards[0];

            console.log('boards', boards);

            return axios.request(configGetUsers);
          })
          .then((responseConfigGetUsers) => {
            console.log(
              'responseConfigGetUsers *********************************',
              // responseConfigGetUsers,
            );
            const users = responseConfigGetUsers.data.data.users[0];
            console.log('users', users);
          })

          .catch((error) => {
            console.log(
              'error ***************************************************************',
              error,
            );
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
