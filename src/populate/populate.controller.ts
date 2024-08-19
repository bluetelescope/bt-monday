import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import { returnGetConfig, returnPostConfig } from 'src/functions/returnConfig';
import {
  returnGetBoardGroupsQuery,
  returnGetUsersQuery,
  returnGetItemQuery,
  returnGetBoardsQuery,
  returnPostBoardQuery,
  returnChangeSimpleValueQuery,
  returnDuplicateItemQuery,
  returnTop25ItemsinBoardQuery,
  returnGetItemFromBoard,
  returnGetItemsFromBoard,
  returnColumnsInBoard,
  returnGetAllItemsFromBoard,
} from 'src/functions/returnQuery';
import {
  parseColumnValues,
  parseBoards,
  parseUsers,
} from 'src/functions/parseData';
import { users, variables } from 'src/variables';

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
// const testItemID = 5104037469;
const PROD_TEAM = 614284;
const ADMIN_TEAM = 614287;

let itemIdFromForm;
let itemId;
let itemName = ''; //Hadley_Colored Musicians Club
let columns = [];
let projectColumnId = 'dropdown';
let boardId;
let newProposalColumnId = 'link';
let newCostColumnId = 'numbers__1';
let proposalItemId;
let actualValueItemId;
let personId;
let personData;

@Controller('populate')
export class PopulateController {
  @Get()
  getMonday() {
    return {};
  }

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
      console.log('populate endpoint data:', data);
      //if there is an event field on the body
      if (!!data.event) {
        console.log('data:', data);
        console.log('data.event', data.event);
        const axios = require('axios');
        itemName = data.event.pulseName;
        itemId = data.event.pulseId;
        const getItemQuery = returnGetItemQuery(itemId);
        const getItemConfig = returnGetConfig(getItemQuery);
        axios
          .request(getItemConfig)
          .then((getItemResponse) => {
            console.log('getItemResponse ***************************');
            // console.log('getItemResponse.data', getItemResponse.data);
            const itemInfo = getItemResponse.data.data.items[0];
            console.log('itemInfo', itemInfo);
            personId = itemInfo.subscribers[0].id || null;
            let boardName = itemInfo.column_values.filter(
              (column) => column.id === 'dropdown',
            )[0].text;
            console.log('boardName', boardName);
            console.log('personId', personId);
            personData = users.filter(
              (person) => person.id === String(personId),
            )[0];
            console.log('personData', personData);
            //get all boards in prod workspace
            const graphqlGetBoards = returnGetBoardsQuery(
              variables.PROD_WORKSPACE,
            );
            let configGetBoards = returnGetConfig(graphqlGetBoards);
            return axios.request(configGetBoards);
          })
          .then((responseGetBoards) => {
            console.log(
              'responseGetBoards.data.data',
              responseGetBoards.data.data,
            );
          })

          .catch((error) => {
            console.log('error.data', error.data);
          });
        //event info has information regarding only the value of this particular column information
        //make a get request: get all information regarding this item
      } else {
        //if there is not an event field on the body
        //it's the verification request
        console.log('no event:', data);
        const requestBody = JSON.stringify({
          challenge: `${data.challenge}`,
        });
        return requestBody; // body is parsed by NestJS
      }
    }
  }
}

// console.log('getColumnsResponse ***************************');
// const columns = getColumnsResponse.data.data.boards[0].columns;
// console.log('columns', columns);
// projectColumnId = columns.filter((col) => col.title === 'Project')[0].id;
// console.log('projectColumnId', projectColumnId);

// const getAllItems = returnGetAllItemsFromBoard(TIMETRACKING_BOARD);
// const getAllItemsConfig = returnGetConfig(getAllItems);
// return axios.request(getAllItemsConfig);
