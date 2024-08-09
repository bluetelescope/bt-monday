import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import {
  returnGetBoardsConfig,
  returnGetUsersConfig,
  returnGetItemConfig,
  returnPostBoardConfig,
  returnPostColumnValueConfig,
  returnGetBoardGroupsConfig,
} from 'src/functions/returnConfig';
import {
  returnPostBoardQuery,
  returnGetUsersQuery,
  returnGetItemQuery,
  returnGetBoardsQuery,
  returnPostColumnValueQuery,
  returnGetBoardGroupsQuery,
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
const TIMETRACKING_ITEM = 6721689025;
const TIMETRACKING_PROJECT_COL = 'dropdown';
const PROD_WORKSPACE = 1080416;
const BIZDEV_WORKSPACE = 3839751;
const MIDLEVEL_FOLDER = 14770065;
const ACTIVE_FOLDER = 7860571;
const testItemID = 5104037469;
const PROD_TEAM = 614284;
const ADMIN_TEAM = 614287;
const graphqlGetItem = returnGetItemQuery(testItemID);
let configGetItem = returnGetItemConfig(graphqlGetItem);
const graphqlGetBoards = returnGetBoardsQuery(PROD_WORKSPACE);
let configGetBoards = returnGetBoardsConfig(graphqlGetBoards);
const graphqlGetUsers = returnGetUsersQuery();
let configGetUsers = returnGetUsersConfig(graphqlGetUsers);
const graphqlGetBoardGroups = returnGetBoardGroupsQuery(5872168554);
let configGetBoardGroups = returnGetBoardGroupsConfig(graphqlGetBoardGroups);
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
            return axios.request(configGetUsers);
          })
          .then((responseConfigGetUsers) => {
            // Parse user data to get admin and prod users----------------------------------------------------------------
            console.log('responseConfigGetUsers **************');
            const usersData = responseConfigGetUsers.data.data.users;
            const userIds = parseUsers(usersData);
            users = userIds;

            // get groups from time tracking board -----------------------------------------------------------------------

            return axios.request(configGetBoardGroups);
          })
          .then((getBoardGroupResponse) => {
            console.log('getBoardGroupResponse **************');
            // parse data from time tracking board groups -----------------------------------------------------------------------

            const graphqlPostColValue = returnPostColumnValueQuery(
              TIMETRACKING_ITEM,
              TIMETRACKING_PROJECT_COL,
              TIMETRACKING_BOARD,
              itemName,
            );
            let configPostColValue =
              returnPostColumnValueConfig(graphqlPostColValue);
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
            let configPostBoard = returnGetUsersConfig(graphqlPostBoard);
            console.log('configPostBoard', configPostBoard);
            // Post board to active projects board----------------------------------------------------------------
            return axios.request(configPostBoard);
          })
          .then((postBoardResponse) => {
            console.log('postBoardResponse **************');
            // POST to add the project name to the timetracking form ------------------------------------------------------
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

//  //prod = owners, admin = subs
//  const graphqlPostBoard = returnPostBoardQuery(
//   TEMPLATE_BOARD,
//   itemName,
//   ACTIVE_FOLDER,
//   PROD_WORKSPACE,
//   userIds.prodTeam,
//   userIds.adminUsers,
//   PROD_TEAM,
//   ADMIN_TEAM,
// );
// let configPostBoard = returnGetUsersConfig(graphqlPostBoard);
// // Post board to active projects board----------------------------------------------------------------
// return axios.request(configPostBoard);
