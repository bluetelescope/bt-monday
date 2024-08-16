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
  returnPostChangeColumnValueQuery,
  returnGetItemsinBoardQuery,
  returnGetItemFromBoard,
} from 'src/functions/returnQuery';
import {
  parseColumnValues,
  parseBoards,
  parseUsers,
} from 'src/functions/parseData';

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
let itemName = ''; //Hadley_Colored Musicians Club
let columns = [];
let users = { adminUsers: [], prodTeam: [] };
let projectColumnId = 'dropdown';
let duplicatedItemID;
let proposalURL;
let actualProjectValue;
let newBoardId;
let newProposalColumnId = 'link';
let newCostColumnId = 'numbers__1';
let proposalItemId;
let actualValueItemId;

@Controller('populate')
export class PopulateController {
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
      console.log('populate endpoint data:', data);
      //if there is an event field on the body
      if (!!data.event) {
        // console.log('data:', data);
        const axios = require('axios');

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
