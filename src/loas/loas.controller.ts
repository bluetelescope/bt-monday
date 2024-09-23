import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import {
  returnGetConfig,
  postConfigWithVariables,
  returnPostConfig,
} from 'src/functions/returnConfig';
import {
  returnGetItemQuery,
  returnGetBoardsQuery,
  returnChangeSimpleValueQuery,
  returnGetItemFromBoardQuery,
  returnColumnsInBoard,
  returnColumnsInSubitem,
  returnSubitemNamesOnItem,
  returnDeleteItem,
} from 'src/functions/returnQuery';
import {
  parseColumnsForIDS,
  parseBoardIDFromSlug,
  parseValueofColumnFromColumnID,
  parseSubColumnValuesForString,
  parseValueFromColumns,
  parseBoardID,
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

let pulseItemId;
let loaItemId;
let itemIDinBoard;
let subitemAmountColumnId = '';

let createNewItem = true;
let oldItemID;
let eventType;
let loasString = 'LOAs';
let typeString = 'Type';
let recipientNameString = 'Recipient Name';
let amountString = 'Amount';
let targetBoardString = 'Project Name';
let nonHrAmountString = '$ Non-Hourly Amount';

let type;
let recipientName;
let amount;
let targetBoardName;
let targetBoardId;

@Controller('loas')
export class LOASController {
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
      console.log('loas endpoint data:', data);
      //if there is an event field on the body
      if (!!data.event) {
        console.log('data:', data);
        console.log('data.event', data.event);
        const axios = require('axios');

        pulseItemId = data.event.pulseId;
        eventType = data.event.value.label.text;

        if (eventType === 'Idle' || eventType === 'Recieved') {
        } else {
          const getItemQuery = returnGetItemQuery(pulseItemId);
          const getItemConfig = returnGetConfig(getItemQuery);
          axios
            .request(getItemConfig)
            .then((getItemResponse) => {
              const itemInfo = getItemResponse.data.data.items[0];
              const columns = itemInfo.column_values;
              console.log('itemInfo', itemInfo);
              console.log('columns', columns);

              type = parseValueFromColumns(columns, typeString);
              recipientName = parseValueFromColumns(
                columns,
                recipientNameString,
              );
              amount = parseValueFromColumns(columns, amountString);
              targetBoardName = parseValueFromColumns(
                columns,
                targetBoardString,
              );

              console.log('type', type);
              console.log('recipientName', recipientName);
              console.log('amount', amount);
              console.log('targetBoardName', targetBoardName);

              // find id of board in production, so
              // get all boards in prod workspace
              const graphqlGetBoards = returnGetBoardsQuery(
                variables.PROD_WORKSPACE,
              );
              let configGetBoards = returnGetConfig(graphqlGetBoards);
              return axios.request(configGetBoards);
            })
            .then((responseConfigGetBoards) => {
              console.log('responseConfigGetBoards **************');
              console.log(
                'responseConfigGetBoards.data.data.boards',
                responseConfigGetBoards.data.data.boards,
              );

              const boards = responseConfigGetBoards.data.data.boards;
              console.log('boards', boards);

              console.log(
                'resGetBoardsQuery *****************************************************************',
              );
              //parse boards data
              targetBoardId = parseBoardID(
                responseConfigGetBoards.data.data.boards,
                targetBoardName,
              );
              console.log('targetBoardId', targetBoardId);
              //GET: item in active project board with persons name
              const getBoardItemQuery = returnGetItemFromBoardQuery(
                targetBoardId,
                'name',
                loasString,
              );
              console.log('getBoardItemQuery', getBoardItemQuery);
              const getBoardItemCofig = returnGetConfig(getBoardItemQuery);
              return axios.request(getBoardItemCofig);
            })
            .then((getLoaItemRes) => {
              console.log(
                'getLoaItemRes *****************************************************************',
              );
              console.log('getLoaItemRes.data', getLoaItemRes.data);

              //parse items data
              loaItemId =
                getLoaItemRes.data.data.boards[0].items_page.items[0].id;

              console.log('loaItemId', loaItemId);
              //GET: columns in subitem
              const getLoaItemColumnsQuery = returnColumnsInSubitem(loaItemId);
              const getLoaItemColumnsConfig = returnGetConfig(
                getLoaItemColumnsQuery,
              );
              return axios.request(getLoaItemColumnsConfig);
            })
            .then((getLoaItemColumnsRes) => {
              console.log(
                'getLoaItemColumnsRes *****************************************************************',
              );
              //parse columns data
              const columns =
                getLoaItemColumnsRes.data.data.items[0].subitems[0]
                  .column_values;
              console.log('columns', columns);

              subitemAmountColumnId = parseSubColumnValuesForString(
                columns,
                nonHrAmountString,
              );

              console.log('subitemAmountColumnId', subitemAmountColumnId);

              //TODO: replace getting the item and replacing the entries with create new subitem
              let postSubitemQuery = `mutation ($columnVals: JSON!,) { create_subitem(parent_item_id: ${itemIDinBoard},item_name: "${recipientName} - ${pulseItemId}",create_labels_if_missing: true, column_values:$columnVals) { id } }`;
              let testing = {};

              testing[`${subitemAmountColumnId}`] = amount;

              let vars = {
                columnVals: JSON.stringify(testing),
              };

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
            // //loa item in target board
            // loaItemId = boardRelation.linkedPulseIds[0].linkedPulseId;
            // newSubitemLabel = `${recipientName} // ItemID: ${pulseItemId}`;
            // console.log('recipientName', recipientName);
            // console.log('cost', cost);
            // console.log('boardRelationValue', boardRelationValue);
            // console.log('boardRelation', boardRelation);
            // console.log('loaItemId', loaItemId);
            // //GET: all subitems of loa item
            // const getSubitemsQuery = returnSubitemNamesOnItem(loaItemId);
            // const getSubitemsConfig = returnGetConfig(getSubitemsQuery);
            // return axios.request(getSubitemsConfig);

            // .then((getSubitemsRes) => {
            //   //IF ITEM ID already exists amonst subitem names, modify item
            //   const subitems = getSubitemsRes.data.data.items[0].subitems;
            //   const itemIDAlreadyExists = subitems.some(
            //     (item) => item.name === newSubitemLabel,
            //   );

            //   if (itemIDAlreadyExists) {
            //     createNewItem = false;
            //     oldItemID = subitems.filter(
            //       (item) => item.name === newSubitemLabel,
            //     )[0].id;
            //   }
            //   //else create new subitem
            //   //GET: columns in subitem elements in active board LOA
            //   const getLoaItemColumnsQuery = returnColumnsInSubitem(loaItemId);
            //   const getLoaItemColumnsConfig = returnGetConfig(getLoaItemColumnsQuery);
            //   return axios.request(getLoaItemColumnsConfig);
            // })
            // .then((getLoaItemColumnsRes) => {
            //   console.log(
            //     'getLoaItemColumnsRes *****************************************************************',
            //   );
            //   //parse columns data
            //   const columns =
            //     getLoaItemColumnsRes.data.data.items[0].subitems[0].column_values;
            //   console.log('columns', columns);

            //   subitemRateColumnId = parseSubColumnValuesForString(
            //     columns,
            //     'Rate',
            //   );
            //   subitemHoursColumnId = parseSubColumnValuesForString(
            //     columns,
            //     'Hours',
            //   );

            //   console.log('subitemRateColumnId', subitemRateColumnId);
            //   console.log('subitemHoursColumnId', subitemHoursColumnId);

            //   //TODO: replace getting the item and replacing the entries with create new subitem
            //   let postSubitemQuery = `mutation ($columnVals: JSON!,) { create_subitem(parent_item_id: ${loaItemId},item_name: "${newSubitemLabel}",create_labels_if_missing: true, column_values:$columnVals) { id } }`;
            //   let testing = {};

            //   testing[`${subitemRateColumnId}`] = 1;
            //   testing[`${subitemHoursColumnId}`] = cost;

            //   console.log('testing', testing);

            //   let vars = {
            //     columnVals: JSON.stringify(testing),
            //   };
            //   console.log('vars', vars);

            //   //POST: new subitem
            //   const postSubitemConfig = postConfigWithVariables(
            //     postSubitemQuery,
            //     vars,
            //   );
            //   console.log('postSubitemConfig', postSubitemConfig);
            //   return axios.request(postSubitemConfig);
            // })
            // .then((postSubitemRes) => {
            //   console.log(
            //     'postCostToColumnRes**********************************************************************',
            //     postSubitemRes.data,
            //   );

            //   if (!createNewItem) {
            //     //POST: delete old value if id is the same
            //     const deleteItemQuery = returnDeleteItem(oldItemID);
            //     const deleteItemConfig = returnPostConfig(deleteItemQuery);
            //     return axios.request(deleteItemConfig);
            //   } else {
            //     return;
            //   }
            // })
            // .then((finalRes) => {
            //   console.log('finalRes.data', finalRes.data);
            // })
            .catch((error) => {
              console.log('error.data', error.data);
            });
        }

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
