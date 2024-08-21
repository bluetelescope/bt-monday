import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import { returnGetConfig, returnPostConfig } from 'src/functions/returnConfig';
import {
  returnGetItemQuery,
  returnGetBoardsQuery,
  returnChangeSimpleValueQuery,
  returnGetItemFromBoard,
  returnColumnsInBoard,
  returnGetAllItemsUpdatesFromBoard,
} from 'src/functions/returnQuery';
import {
  parseColumnsForIDS,
  parseBoardIDFromSlug,
  parseValueofColumnFromColumnID,
} from 'src/functions/parseData';
import { users, variables } from 'src/variables';

let itemId;
let hoursFromForm = '0';
let projectColumnId = 'dropdown';
let boardId;
let boardName;
let newCostColumnId = 'numbers__1';
let proposalItemId;
let actualValueItemId;
let personId;
let personData;
let personTitle;
let itemIDinBoard;
let costColumnId = '';
let hoursColumnId = '';
let currentCostValue = '';
let currentHoursValue = '';
let newCostValue = '';
let newHoursValue = '';
let rate = 0;
let boardSlug;

@Controller('google')
export class GoogleController {
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
        //event info has information regarding only the value of this particular column information
        //make a get request: get all information regarding this item
        const axios = require('axios');

        const getUpdatesQuery = returnGetAllItemsUpdatesFromBoard(
          variables.PIPELINE_BOARD,
        );
        const getUpdatesConfig = returnGetConfig(getUpdatesQuery);
        axios
          .request(getUpdatesConfig)
          .then((getUpdatesResponse) => {
            console.log(
              'getUpdatesResponse.data.data',
              getUpdatesResponse.data.data.boards[0],
            );
            console.log(
              'getUpdatesResponse.data.data.boards[0].items_page',
              getUpdatesResponse.data.data.boards[0].items_page,
            );
            const groups =
              getUpdatesResponse.data.data.boards[0].items_page.items.groups;
            console.log('groups', groups);
            const opportunities = groups.filter(
              (group) => group.title === 'Opportunity',
            )[0];
            console.log('opportunities', opportunities);
            const itemsWithUpdates = opportunities.items_page.items.filter(
              (item) => item.updates.length !== 0,
            );
            console.log('itemsWithUpdates', itemsWithUpdates);
          })
          .catch((error) => {
            console.log('error.data', error.data);
          });
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
