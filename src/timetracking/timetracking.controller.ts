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
  returnGetBoardGroupsQuery,
  returnGetUsersQuery,
  returnGetItemQuery,
  returnGetBoardsQuery,
  returnPostBoardQuery,
  returnPostColumnValueQuery,
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

let itemName = ''; //Hadley_Colored Musicians Club
let subscribers = []; //[ { id: '23774585' }, { id: '26473580' } ]
let columns = [];
let users = { adminUsers: [], prodTeam: [] };

@Controller('monday')
export class TimetrackingController {
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
      } else {
        //if there is not an event field on the body
        //it's the verification request
        console.log('no event:', data);
        const requestBody = JSON.stringify({
          challenge: `${data.challenge}`,
        });
        return requestBody;
      }
    }
  }
}
