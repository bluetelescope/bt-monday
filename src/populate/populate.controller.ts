import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import {
  returnGetConfig,
  returnPostConfig,
  postConfigWithVariables,
} from 'src/functions/returnConfig';
import {
  returnGetItemQuery,
  returnGetBoardsQuery,
  returnGetItemFromBoardQuery,
  returnColumnsInSubitem,
} from 'src/functions/returnQuery';
import {
  parseColumnsForIDS,
  parseBoardIDFromSlug,
  parseValueofColumnFromColumnID,
  parseSubColumnValuesForString,
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
const PROD_TEAM = 614284;
const ADMIN_TEAM = 614287;

let itemId;
let hoursFromForm = '0';
let projectColumnId = 'dropdown';
let boardId;
let boardName;
let newCostColumnId = 'numbers__1';
let proposalItemId;
let sellPriceItemId;
let personId;
let personData;
let personTitle;
let itemIDinBoard;
let personName = '';
let rate = 0;
let actualRate = 0;
let billedRate = 0;
let cost;
let label = ' ';
let subitemNameColumnId = '';
let subitemRateColumnId = '';
let subitemActualRateColumnId = '';
let subitemBilledRateColumnId = '';
let subitemIsHourlyColumnId = '';
let subitemHoursColumnId = '';
let subitemTimelineColumnId = '';
let subitemNameColumnString = 'Name';
let subitemIsHourlyColumnString = 'Calculate Hourly Rate?';
let subitemRateColumnString = 'Rate';
let subitemActualRateColumnString = 'Actual Rate';
let subitemBilledRateColumnString = 'Billed Rate';
let subitemHoursColumnString = 'Hours';
let subitemTimelineColumnString = 'Hours Timeline';
let boardSlug;
let dateRangeData;
let dateRangeValue;
let itemDescription;

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
        const getItemConfig = returnPostConfig(getItemQuery);
        console.log('getItemConfig', getItemConfig);

        axios
          .request(getItemConfig)
          .then((getItemResponse) => {
            console.log('getItemResponse ***************************');
            const itemInfo = getItemResponse.data.data.items[0];
            console.log('itemInfo', itemInfo);
            personName = itemInfo.column_values.filter(
              (column) => column.id === 'multi_select1__1',
            )[0].text;
            boardName = itemInfo.column_values.filter(
              (column) => column.id === 'dropdown',
            )[0].text;
            boardSlug = boardName.substring(0, 4);
            hoursFromForm = itemInfo.column_values.filter(
              (column) => column.id === 'numbers',
            )[0].text;
            dateRangeValue = itemInfo.column_values.filter(
              (column) => column.id === 'date_range',
            )[0].value;
            dateRangeData = JSON.parse(dateRangeValue);

            console.log('personName', personName);
            console.log('hoursFromForm', hoursFromForm);
            console.log('boardName', boardName);
            console.log('dateRangeValue', dateRangeValue);
            console.log('dateRangeData', dateRangeData);

            personData = users.filter(
              (person) => person.name === String(personName),
            )[0];

            personTitle = personData.title;
            // rate = personData.rate;
            actualRate = personData.actualRate;
            billedRate = personData.billedRate;
            cost = `${Number(hoursFromForm) * Number(rate) * -1}`;

            console.log('personData', personData);

            //get all boards in prod workspace

            const graphqlGetBoards = returnGetBoardsQuery(
              variables.PROD_WORKSPACE,
            );
            let configGetBoards = returnPostConfig(graphqlGetBoards);
            return axios.request(configGetBoards);
          })
          .then((responseGetBoards) => {
            // console.log(
            //   'responseGetBoards.data.data',
            //   responseGetBoards.data.data,
            // );
            boardId = parseBoardIDFromSlug(
              responseGetBoards.data.data.boards,
              boardSlug,
            );
            console.log('boardId', boardId);

            //GET: item in active project board with persons name
            const getBoardItemQuery = returnGetItemFromBoardQuery(
              boardId,
              'name',
              personData.title,
            );
            console.log('getBoardItemQuery', getBoardItemQuery);
            const getBoardItemCofig = returnPostConfig(getBoardItemQuery);
            return axios.request(getBoardItemCofig);
          })
          .then((getBoardItemsRes) => {
            console.log(
              'getBoardItemsRes *****************************************************************',
            );
            console.log(
              'getBoardItemsRes.data.data',
              getBoardItemsRes.data.data,
            );

            itemIDinBoard =
              getBoardItemsRes.data.data.boards[0].items_page.items[0].id;

            //GET: columns in subitem
            const getItemColumnsQuery = returnColumnsInSubitem(itemIDinBoard);
            const getItemColumnsConfig = returnPostConfig(getItemColumnsQuery);
            return axios.request(getItemColumnsConfig);
          })
          .then((getItemColumnsRes) => {
            console.log(
              'getItemColumnsRes *****************************************************************',
            );
            //parse columns data
            const columns =
              getItemColumnsRes.data.data.items[0].subitems[0].column_values;
            console.log('columns', columns);
            console.log('got there 1');

            subitemNameColumnId = parseSubColumnValuesForString(
              columns,
              subitemNameColumnString,
            );
            console.log('got there 2');
            subitemIsHourlyColumnId = parseSubColumnValuesForString(
              columns,
              subitemIsHourlyColumnString,
            );

            subitemHoursColumnId = parseSubColumnValuesForString(
              columns,
              subitemHoursColumnString,
            );
            subitemTimelineColumnId = parseSubColumnValuesForString(
              columns,
              subitemTimelineColumnString,
            );
            // subitemRateColumnId = parseSubColumnValuesForString(
            //   columns,
            //   subitemRateColumnString,
            // );
            subitemActualRateColumnId = parseSubColumnValuesForString(
              columns,
              subitemActualRateColumnString,
            );
            subitemBilledRateColumnId = parseSubColumnValuesForString(
              columns,
              subitemBilledRateColumnString,
            );

            console.log('subitemNameColumnId', subitemNameColumnId);
            console.log('subitemIsHourlyColumnId', subitemIsHourlyColumnId);
            console.log('subitemActualRateColumnId', subitemActualRateColumnId);
            console.log('subitemBilledRateColumnId', subitemBilledRateColumnId);
            console.log('subitemHoursColumnId', subitemHoursColumnId);
            console.log('subitemTimelineColumnId', subitemTimelineColumnId);

            //TODO: replace getting the item and replacing the entries with create new subitem
            let postSubitemQuery = `mutation ($columnVals: JSON!,) { create_subitem(parent_item_id: ${itemIDinBoard},item_name: "Hours Log",create_labels_if_missing: true, column_values:$columnVals) { id } }`;
            let testing = {
              // person: {
              //   personsAndTeams: [{ id: personId, kind: 'person' }],
              // },
            };
            testing[`${subitemNameColumnId}`] = personName;

            testing[`${subitemIsHourlyColumnId}`] = { label: 'YES' };
            // testing[`${subitemRateColumnId}`] = rate;
            testing[`${subitemActualRateColumnId}`] = actualRate;
            testing[`${subitemBilledRateColumnId}`] = billedRate;
            testing[`${subitemHoursColumnId}`] = hoursFromForm;
            testing[`${subitemTimelineColumnId}`] = {
              to: dateRangeData.to,
              from: dateRangeData.from,
              changed_at: dateRangeData.changed_at,
            };
            console.log('testing', testing);

            let vars = {
              columnVals: JSON.stringify(testing),
            };
            console.log('vars', vars);

            //POST: new subitem
            const postSubitemConfig = postConfigWithVariables(
              postSubitemQuery,
              vars,
            );
            console.log('postSubitemConfig', postSubitemConfig);
            return axios.request(postSubitemConfig);
          })
          .then((postSubitemRes) => {
            console.log(
              'postCostToColumnRes**********************************************************************',
              postSubitemRes.data,
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
