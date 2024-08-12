import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import { returnGetConfig, returnPostConfig } from 'src/functions/returnConfig';
import {
  returnGetBoardGroupsQuery,
  returnGetUsersQuery,
  returnGetItemQuery,
  returnGetBoardsQuery,
  returnPostBoardQuery,
  returnPostTimetrackLabelQuery,
  returnPostTimetrackItemQuery,
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
import { bindCallback } from 'rxjs';

const TEMPLATE_BOARD = 6198096739;
const PIPELINE_BOARD = 5552219681;
const TIMETRACKING_BOARD = 5872168554;
const TIMETRACKING_ITEM_FORLABEL = 6721689025;
const TIMETRACKING_ITEM_FORACTIVE = 7209467255;
const TIMETRACKING_PROJECT_COL = 'dropdown';
const PROD_WORKSPACE = 1080416;
const BIZDEV_WORKSPACE = 3839751;
const MIDLEVEL_FOLDER = 14770065;
const ACTIVE_FOLDER = 7860571;
const testItemID = 5104037469;
const PROD_TEAM = 614284;
const ADMIN_TEAM = 614287;
const graphqlGetItem = returnGetItemQuery(testItemID);
let configGetItem = returnGetConfig(graphqlGetItem);
const graphqlGetBoards = returnGetBoardsQuery(PROD_WORKSPACE);
let configGetBoards = returnGetConfig(graphqlGetBoards);
const graphqlGetUsers = returnGetUsersQuery();
let configGetUsers = returnGetConfig(graphqlGetUsers);
const graphqlGetBoardGroups = returnGetBoardGroupsQuery(5872168554);
let configGetBoardGroups = returnGetConfig(graphqlGetBoardGroups);
let itemName = ''; //Hadley_Colored Musicians Club
let subscribers = []; //[ { id: '23774585' }, { id: '26473580' } ]
let columns = [];
let users = { adminUsers: [], prodTeam: [] };

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

  // POST
  //when an items status is changed, this triggers a casacade which:
  // + new board in active items
  // + new time tracking label
  // + new time tracking item
  // +
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

        axios
          // GET ITEM ---------------------------------------------------------------------------------------------------
          .request(configGetItem)
          .then((responseConfigGetItem) => {
            // Parse item data ---------------------------------------------------------------------------------------------------
            console.log('responseConfigGetItem **************');
            const item = responseConfigGetItem.data.data.items[0];
            console.log('item', item);
            itemName = item.name.replace('_', ' '); //Hadley_Colored Musicians Club
            subscribers = item.subscribers; //[ { id: '23774585' }, { id: '26473580' } ]
            columns = item.column_values;
            const columnData = parseColumnValues(item.column_values);
            console.log('columnData', columnData);
            // GET boards, to calcuate item number -----------------------------------------------------------------------
            return axios.request(configGetBoards);
          })
          .then((responseConfigGetBoards) => {
            // Parse boards data, to calcuate item number -----------------------------------------------------------------------
            console.log('responseConfigGetBoards **************');
            //
            const boards = responseConfigGetBoards.data.data.boards;
            console.log('boards', boards);
            const boardNumber = parseBoards(boards, ACTIVE_FOLDER);
            itemName = `${boardNumber}_${itemName}`;
            // Get users data -------------------------------------------------------------------------------------------

            const graphqlPostColValue = returnPostTimetrackLabelQuery(
              TIMETRACKING_ITEM_FORLABEL,
              TIMETRACKING_PROJECT_COL,
              TIMETRACKING_BOARD,
              itemName,
            );
            let configPostColValue = returnPostConfig(graphqlPostColValue);
            // POST new label to time tracking column -----------------------------------------------------------------------
            return axios.request(configPostColValue);
          })
          .then((postColValueResponse) => {
            console.log('postColValueResponse **************');
            // POST to add the project name to the timetracking form ------------------------------------------------------

            //prod = owners, admin = subs
            const graphqlPostBoard = returnPostBoardQuery(
              TEMPLATE_BOARD,
              itemName,
              ACTIVE_FOLDER,
              PROD_WORKSPACE,
              users.prodTeam,
              users.adminUsers,
              PROD_TEAM,
              ADMIN_TEAM,
            );
            let configPostBoard = returnGetConfig(graphqlPostBoard);
            console.log('configPostBoard', configPostBoard);
            // Post board to active projects board----------------------------------------------------------------
            return axios.request(configPostBoard);
          })
          .then((postBoardResponse) => {
            console.log('postBoardResponse **************');
            const graphqlPostTimeTrackItemValue = returnPostTimetrackItemQuery(
              TIMETRACKING_ITEM_FORACTIVE,
              TIMETRACKING_BOARD,
            );
            let configPostTimeTrackItem = returnPostConfig(
              graphqlPostTimeTrackItemValue,
            );
            // POST new label to time tracking column -----------------------------------------------------------------------
            return axios.request(configPostTimeTrackItem);
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
