import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import { returnGetConfig, returnPostConfig } from 'src/functions/returnConfig';

import {
  returnGetItemsinBoardQuery,
  returnGetBoardsQuery,
} from 'src/functions/returnQuery';
import {
  parseColumnValues,
  parseBoards,
  parseUsers,
  parseBoardID,
  parseItemID,
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

const users = [
  {
    id: '23774585',
    rate: 150,
    name: 'Trent Oliver',
    title: 'Principal + Managing Director',
  },
  {
    id: '25891866',
    rate: 150,
    name: 'Dustin Stephan',
    title: 'Sr. Creative Producer',
  },
  {
    id: '26473580',
    rate: 150,
    name: 'Judith Zissman',
    title: 'Exec. Creative Director',
  },
  {
    id: '26815252',
    rate: 150,
    name: 'Reese Patillo',
    title: 'Sr. Creative Designer',
  },
  {
    id: '27253155',
    rate: 150,
    name: 'Shane Gallardo',
    title: 'Back Office Support',
  },
  {
    id: '27397545',
    rate: 150,
    name: 'Ron Cunningham',
    title: 'Senior Creative Technologist',
  },
  {
    id: '27397551',
    rate: 150,
    name: 'Valeria',
    title: 'Lead Creative Developer',
  },
  {
    id: '37385671',
    name: 'Carly Hayter',
    rate: 150,

    title: 'Creative Software Developer',
  },
  {
    id: '38929843',
    rate: 150,
    name: 'Patti Sande',
    title: 'Back Office Administration - Support President/Owner',
  },
  {
    id: '42467420',
    rate: 150,
    name: 'Anthony DeRita',
    title: 'Creative Producer',
  },
  {
    id: '42749849',
    rate: 150,
    name: 'Gianna Capadona',
    title: 'Creative Producer',
  },
  {
    id: '48317427',
    rate: 150,
    name: 'Renee Mancino',
    title: 'Director of Creative Growth',
  },
  {
    id: '62282324',
    rate: 150,
    name: 'Gabo Núñez Rojas',
    title: 'Creative Graphic Designer',
  },
  {
    id: '64324790',
    rate: 150,
    name: 'Patrick Snee',
    title: null,
  },
];

let hours = 0;
let cost = 0;
let personId = '';
let label = ' ';
let boardID = 0;
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
        console.log(
          'data ******************************************************************',
          data,
        );

        if (data.event.type === 'create_pulse' && !!data.event.columnValues) {
          console.log(
            'event is create pulse ****************************************************',
          );

          const formData = data.event.columnValues;
          label = formData.dropdown.chosenValues[0].name;
          personId = String(formData.person.personsAndTeams[0].id);
          hours = formData.numbers.value;
          console.log('personId', personId); //{ chosenValues: [ { id: 44, name: 'testLabel' } ] }
          console.log('label', formData.dropdown.chosenValues[0].name); //{ chosenValues: [ { id: 44, name: 'testLabel' } ] }
          console.log('hours', hours);

          const graphqlGetBoards = returnGetBoardsQuery(PROD_WORKSPACE);
          const getBoardsQuery = returnGetConfig(graphqlGetBoards);
          // console.log('getBoardsQuery', getBoardsQuery);
          axios
            .request(getBoardsQuery)
            .then((resGetBoards) => {
              console.log(
                'resGetBoardsQuery *****************************************************************',
              );
              // console.log(
              //   'resGetBoards.data.data.boards',
              //   resGetBoards.data.data.boards,
              // );

              boardID = parseBoardID(resGetBoards.data.data.boards, label);
              console.log('boardID', boardID);
              // const itemID = parseItemID(users, resGetBoards.data.data.boards, personId);
              // console.log('itemID', itemID);
              const getBoardItemsQuery = returnGetItemsinBoardQuery(boardID);
              const getBoardItemsCofig = returnGetConfig(getBoardItemsQuery);
              console.log('getBoardItemsCofig', getBoardItemsCofig);
              axios.request(getBoardItemsCofig);
            })
            .then((getBoardItemsRes) => {
              console.log(
                'getBoardItemsRes *****************************************************************',
              );
              console.log('getBoardItemsRes', getBoardItemsRes);
            })
            .catch((error) => {
              console.log(
                'error ***************************************************************',
                error,
              );
            });
        } else {
          console.log(
            'ERROR: event type is not create pulse, or column values does not exist ***********************************************',
          );
        }
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
