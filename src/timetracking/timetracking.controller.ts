import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import {
  returnGetBoardsConfig,
  returnGetUsersConfig,
  returnGetItemConfig,
  returnPostBoardConfig,
  returnPostTimetrackLabelConfig,
  returnGetBoardGroupsConfig,
} from 'src/functions/returnConfig';
import {
  returnGetBoardGroupsQuery,
  returnGetUsersQuery,
  returnGetItemQuery,
  returnGetBoardsQuery,
  returnPostBoardQuery,
  returnPostTimetrackLabelQuery,
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
const TIMETRACKING_GROUP_ACTIVE = 'duplicate_of_products';
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

let itemName = ''; //Hadley_Colored Musicians Club
let subscribers = []; //[ { id: '23774585' }, { id: '26473580' } ]
let columns = [];
let users = { adminUsers: [], prodTeam: [] };

@Controller('timetracking')
export class TimetrackingController {
  // POST validate
  @Get()
  getTimetracking() {
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
      //if there is an event field on the body
      if (!!data.event) {
        // data: {
        //   event: {
        //     app: 'monday',
        //     type: 'create_pulse',
        //     triggerTime: '2024-08-09T20:40:34.198Z',
        //     subscriptionId: 396074603,
        //     userId: -6,
        //     originalTriggerUuid: null,
        //     boardId: 5872168554,
        //     pulseId: 7199391638,
        //     pulseName: 'Incoming form answer',
        //     groupId: 'new_group14586',
        //     groupName: 'New',
        //     groupColor: '#c4c4c4',
        //     isTopGroup: false,
        //     columnValues: {
        //       dropdown: [Object],
        //       person: [Object],
        //       numbers: [Object],
        //       date_range: [Object]
        //     },
        //     triggerUuid: '59ea1cf96b3ded9aac6ab99deb8ad8e5'
        //   }
        // }
        if (data.event.type === 'create_pulse') {
          const formData = data.event.columnValues;
          console.log('formData.dropdown', formData.dropdown); //{ chosenValues: [ { id: 44, name: 'testLabel' } ] }
          console.log('formData.person', formData.person);
          //   {
          //   changed_at: '2024-08-09T21:31:59.927Z',
          //   personsAndTeams: [ { id: 37385671, kind: 'person' } ]
          // }
          console.log('formData.numbers', formData.numbers);
          // {
          //   value: 10,b
          //   unit: { symbol: 'custom', custom_unit: ' Hours', direction: 'right' }
          // }
          console.log('formData.date_range', formData.date_range);
          // {
          //   from: '2024-08-01',
          //   to: '2024-08-04',
          //   visualization_type: null,
          //   changed_at: '2024-08-09T21:31:59.943Z'
          // }

          //TODO: create new item in 'active' group in timetracking board
          //TODO: get group names from timetracking board
        }
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
