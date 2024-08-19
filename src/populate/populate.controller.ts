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
  parseBoardID,
  parseColumnsForIDS,
  parseBoardIDFromSlug,
  parseValueofColumnFromColumnID,
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
            boardName = itemInfo.column_values.filter(
              (column) => column.id === 'dropdown',
            )[0].text;
            boardSlug = boardName.substring(0, 4);
            hoursFromForm = itemInfo.column_values.filter(
              (column) => column.id === 'numbers',
            )[0].text;
            console.log('hoursFromForm', hoursFromForm);
            console.log('boardName', boardName);
            console.log('personId', personId);

            personData = users.filter(
              (person) => person.id === String(personId),
            )[0];

            personId = personData.id;
            personTitle = personData.title;
            rate = personData.rate;

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
            boardId = parseBoardIDFromSlug(
              responseGetBoards.data.data.boards,
              boardSlug,
            );
            console.log('boardId', boardId);
            const getBoardItemQuery = returnGetItemFromBoard(
              boardId,
              'name',
              personData.title,
            );
            const getBoardItemsCofig = returnGetConfig(getBoardItemQuery);
            return axios.request(getBoardItemsCofig);
          })
          .then((getBoardItemsRes) => {
            console.log(
              'getBoardItemsRes *****************************************************************',
            );
            console.log(
              'getBoardItemsRes.data.data',
              getBoardItemsRes.data.data,
            );
            //parse items data
            itemIDinBoard =
              getBoardItemsRes.data.data.boards[0].items_page.items[0].id;
            console.log('itemIDinBoard', itemIDinBoard);
            //GET: columns in active project
            const getBoardColumnsQuery = returnColumnsInBoard(boardId);
            const getBoardColumnsConfig = returnGetConfig(getBoardColumnsQuery);
            return axios.request(getBoardColumnsConfig);
          })
          .then((getBoardColumnsRes) => {
            console.log(
              'getBoardColumnsRes.data.data',
              getBoardColumnsRes.data.data,
            );

            //parse columns data
            const { costColumnID, hoursColumnID } = parseColumnsForIDS(
              getBoardColumnsRes.data.data.boards[0].columns,
            );
            costColumnId = costColumnID;
            hoursColumnId = hoursColumnID;

            //GET: get item data
            const getItemQuery = returnGetItemQuery(itemIDinBoard);
            const getItemConfig = returnGetConfig(getItemQuery);
            return axios.request(getItemConfig);
          })
          .then((getItemRes) => {
            //parse item data
            console.log('getItemRes.data', getItemRes.data.data);
            const itemColumns = getItemRes.data.data.items[0].column_values;

            currentHoursValue = parseValueofColumnFromColumnID(
              itemColumns,
              hoursColumnId,
            );
            currentCostValue = parseValueofColumnFromColumnID(
              itemColumns,
              costColumnId,
            );
            console.log('currentHoursValue', currentHoursValue);
            console.log('currentCostValue', currentCostValue);

            newHoursValue = `${
              Number(currentHoursValue === null ? 0 : currentHoursValue) +
              Number(hoursFromForm)
            }`;
            newCostValue = `${Number(newHoursValue === null ? 0 : newHoursValue) * Number(rate)}`;
            console.log('newHoursValue', newHoursValue);
            console.log('newCostValue', newCostValue);

            //POST: hoursFromForm value to column
            const postHoursToColumnQuery = returnChangeSimpleValueQuery(
              boardId,
              hoursColumnId,
              itemIDinBoard,
              newHoursValue,
            );
            const postHoursToColumnConfig = returnPostConfig(
              postHoursToColumnQuery,
            );
            return axios.request(postHoursToColumnConfig);
          })
          .then((postHoursToColumnRes) => {
            console.log('postHoursToColumnRes*************************');
            console.log(postHoursToColumnRes.data.data);
            //parse hoursFromForm result

            const postCostToColumnQuery = returnChangeSimpleValueQuery(
              boardId,
              costColumnId,
              itemIDinBoard,
              newCostValue,
            );

            const postCostToColumnConfig = returnPostConfig(
              postCostToColumnQuery,
            );
            return axios.request(postCostToColumnConfig);
          })
          .then((postCostToColumnRes) => {
            console.log(
              'postCostToColumnRes**********************************************************************',
              postCostToColumnRes.data,
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
