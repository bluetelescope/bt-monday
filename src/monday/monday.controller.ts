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
        const axios = require('axios');
        itemIdFromForm = data.event.pulseId;
        //get: item data
        const graphqlGetItem = returnGetItemQuery(itemIdFromForm);
        let configGetItem = returnGetConfig(graphqlGetItem);

        axios
          .request(configGetItem)
          .then((responseConfigGetItem) => {
            // parse item data
            console.log('responseConfigGetItem **************');
            const item = responseConfigGetItem.data.data.items[0];
            itemName = item.name.replace('_', ' ');
            columns = item.column_values;
            const columnData = parseColumnValues(item.column_values);

            //get all boards in prod workspace
            const graphqlGetBoards = returnGetBoardsQuery(PROD_WORKSPACE);
            let configGetBoards = returnGetConfig(graphqlGetBoards);
            return axios.request(configGetBoards);
          })
          .then((responseConfigGetBoards) => {
            console.log('responseConfigGetBoards **************');
            // Parse boards data
            const boards = responseConfigGetBoards.data.data.boards;
            const boardNumber = parseBoards(boards, ACTIVE_FOLDER);
            itemName = `${boardNumber}_${itemName}`;
            // post: new board to active folder in prod workspace
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
            return axios.request(configPostBoard);
          })
          .then((postBoardResponse) => {
            console.log('postBoardResponse **************');
            console.log('postBoardResponse', postBoardResponse.data);

            //post: duplicate item in 'active' group of time tracking board
            const graphqlDuplicateTimeTrackItem = returnPostTimetrackItemQuery(
              TIMETRACKING_ITEM_FORACTIVE,
              TIMETRACKING_BOARD,
            );
            let configDuplicateTimeTrackItem = returnPostConfig(
              graphqlDuplicateTimeTrackItem,
            );
            return axios.request(configDuplicateTimeTrackItem);
          })
          // .then((postColValueLabelResponse) => {
          //   console.log('postColValueLabelResponse **************');
          //   console.log(
          //     'postColValueLabelResponse.data',
          //     postColValueLabelResponse.data,
          //   );

          // })
          .then((postTimeTrackItemRes) => {
            console.log('postTimeTrackItemRes **************');
            console.log('postTimeTrackItemRes.data', postTimeTrackItemRes.data);
            duplicatedItemID = postTimeTrackItemRes.data.data.event.pulseId;
            //Post: get newly created
            const getItemQuery = returnGetItemQuery(duplicatedItemID);
            let configGetItem = returnGetConfig(getItemQuery);
            return axios.request(configGetItem);
          })
          .then((getItemResponse) => {
            console.log('getItemResponse **************');
            console.log(
              'getItemResponse.data',
              getItemResponse.data.data.column_values,
            );
          })
          // .then((changeLabelResponse) => {
          //   console.log('changeLabelResponse ****************************');
          //   console.log('changeLabelResponse.data', changeLabelResponse.data);
          // })
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

// post new label to time tracking board
// const graphqlPostCoLabelValue = returnPostTimetrackLabelQuery(
//   TIMETRACKING_ITEM_FORLABEL,
//   TIMETRACKING_PROJECT_COL,
//   TIMETRACKING_BOARD,
//   itemName,
// );
// let configPostColLabelValue = returnPostConfig(
//   graphqlPostCoLabelValue,
// );
// return axios.request(configPostColLabelValue);
