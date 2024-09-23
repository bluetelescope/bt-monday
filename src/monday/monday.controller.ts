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
  returnPostBoardQuery,
  returnChangeSimpleValueQuery,
  returnDuplicateItemQuery,
  returnGetItemFromBoardQuery,
  returnGet2ItemsFromBoardQuery,
} from 'src/functions/returnQuery';
import {
  parseColumnValues,
  parseBoards,
  parseValueFromColumns,
} from 'src/functions/parseData';
import { variables } from 'src/variables';

let itemIdFromForm;
let itemName = ''; //Hadley_Colored Musicians Club
let columns = [];
let users = { adminUsers: [], prodTeam: [] };
let duplicatedItemID;
let proposalURL;
let sellPrice;
let newBoardId;
let estimatedCost;
let newProposalColumnId = 'link';
let newCostColumnId = 'numbers__1';
let subitemRateColId = 'numbers9__1';
let subitemHourColId = 'numbers__1';
let sellPriceString = 'Sell Price';
let estCostString = 'Estimated Cost';

let estimatedCostItemId;
let sellPriceItemId;
let newSubitemBoardId;
let subitemEstimatedCostId;
let boardSlug;

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
        // console.log('data:', data);
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
            console.log(
              'responseConfigGetItem.data.data.items[0]',
              responseConfigGetItem.data.data.items[0],
            );
            itemName = item.name.replace('_', ' ');
            columns = item.column_values;
            console.log('columns', columns);
            //get the APC and PC from the pipeline item
            sellPrice = parseValueFromColumns(columns, sellPriceString);
            estimatedCost = parseValueFromColumns(columns, estCostString);
            console.log('sellPrice', sellPrice);
            console.log('estimatedCost', estimatedCost);

            //get all boards in prod workspace, so we can generate the number for the new board
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

            // Parse boards data to generate the new number
            const boards = responseConfigGetBoards.data.data.boards;
            const boardNumber = parseBoards(boards, variables.ACTIVE_FOLDER);
            itemName = `${boardNumber}_${itemName}`;

            // post: new board to active folder in prod workspace
            const graphqlPostBoard = returnPostBoardQuery(
              variables.TEMPLATE_BOARD,
              itemName,
              variables.ACTIVE_FOLDER,
              variables.PROD_WORKSPACE,
              users.prodTeam,
              users.adminUsers,
              variables.PROD_TEAM,
              variables.ADMIN_TEAM,
            );
            let configPostBoard = returnGetConfig(graphqlPostBoard);
            console.log('configPostBoard', configPostBoard);
            return axios.request(configPostBoard);
          })
          .then((postBoardResponse) => {
            console.log('postBoardResponse **************');
            console.log('postBoardResponse', postBoardResponse.data);
            newBoardId = postBoardResponse.data.data.create_board.id;

            //post: duplicate item in 'active' group of time tracking board
            const graphqlDuplicateTimeTrackItem = returnDuplicateItemQuery(
              variables.TIMETRACKING_ITEM_FORACTIVE,
              variables.TIMETRACKING_BOARD,
            );
            let configDuplicateTimeTrackItem = returnPostConfig(
              graphqlDuplicateTimeTrackItem,
            );
            return axios.request(configDuplicateTimeTrackItem);
          })
          .then((postTimeTrackItemRes) => {
            console.log('postTimeTrackItemRes **************');
            console.log('postTimeTrackItemRes.data', postTimeTrackItemRes.data);
            duplicatedItemID = postTimeTrackItemRes.data.data.duplicate_item.id;

            const changeLabelQuery = returnChangeSimpleValueQuery(
              variables.TIMETRACKING_BOARD,
              variables.TIMETRACKING_PROJECT_COL,
              duplicatedItemID,
              itemName,
            );
            const changeLabelConfig = returnPostConfig(changeLabelQuery);
            return axios.request(changeLabelConfig);
          })
          .then((changeLabelResponse) => {
            console.log('changeLabelResponse ****************************');
            console.log('changeLabelResponse.data', changeLabelResponse.data);

            const changeNameQuery = returnChangeSimpleValueQuery(
              variables.TIMETRACKING_BOARD,
              'name',
              duplicatedItemID,
              itemName,
            );
            const changeNameConfig = returnPostConfig(changeNameQuery);
            return axios.request(changeNameConfig);
          })
          .then((changeNameResponse) => {
            console.log('changeNameResponse ****************************');
            console.log('changeNameResponse.data', changeNameResponse.data);

            const getSellPriceItemQuery = returnGetItemFromBoardQuery(
              newBoardId,
              'name',
              'Sell Price',
            );
            const getSellPriceItemConfig = returnGetConfig(
              getSellPriceItemQuery,
            );
            console.log('getSellPriceItemConfig', getSellPriceItemConfig);
            return axios.request(getSellPriceItemConfig);
          })
          .then((sellPriceItemResponse) => {
            console.log('sellPriceItemResponse ****************************');
            console.log(
              'sellPriceItemResponse.data',
              sellPriceItemResponse.data,
            );

            //parse items data
            sellPriceItemId =
              sellPriceItemResponse.data.data.boards[0].items_page.items[0].id;
            console.log('sellPriceItemId', sellPriceItemId);

            const getEstimatedCostItemQuery = returnGetItemFromBoardQuery(
              newBoardId,
              'name',
              'Estimated Cost',
            );
            const getEstimatedCostItemConfig = returnGetConfig(
              getEstimatedCostItemQuery,
            );
            console.log(
              'getEstimatedCostItemConfig',
              getEstimatedCostItemConfig,
            );
            return axios.request(getEstimatedCostItemConfig);
          })
          .then((getEstimatedCostItem) => {
            console.log('getEstimatedCostItem ****************************');
            console.log(
              'getEstimatedCostItem.data.data.boards[0].items_page.items[0]',
              getEstimatedCostItem.data.data.boards[0].items_page.items[0],
            );
            console.log(
              'getEstimatedCostItem.data.data.boards[0].items_page.items[0].id',
              getEstimatedCostItem.data.data.boards[0].items_page.items[0].id,
            );
            estimatedCostItemId =
              getEstimatedCostItem.data.data.boards[0].items_page.items[0].id;
            console.log('estimatedCostItemId', estimatedCostItemId);
            let postSubitemAPVQuery = `mutation ($columnVals: JSON!,) { create_subitem(parent_item_id: ${sellPriceItemId},item_name: "Sell Price Subitem",create_labels_if_missing: true, column_values:$columnVals) { id } }`;
            let testing = {};

            testing[`${subitemHourColId}`] = sellPrice;
            testing[`${subitemRateColId}`] = -1;
            let vars = {
              columnVals: JSON.stringify(testing),
            };
            //POST: new subitem
            const postSubitemConfig = postConfigWithVariables(
              postSubitemAPVQuery,
              vars,
            );
            console.log('postSubitemConfig', postSubitemConfig);
            return axios.request(postSubitemConfig);
          })
          .then((postAPVSubitemResponse) => {
            console.log('postAPVSubitemResponse ****************************');
            console.log('postAPVSubitemResponse', postAPVSubitemResponse);

            let postSubitemPCQuery = `mutation ($columnVals: JSON!,) { create_subitem(parent_item_id: ${estimatedCostItemId},item_name: "Sell Price Subitem",create_labels_if_missing: true, column_values:$columnVals) { id } }`;
            let testing = {};

            testing[`${subitemHourColId}`] = estimatedCost;
            testing[`${subitemRateColId}`] = -1;
            let vars = {
              columnVals: JSON.stringify(testing),
            };
            //POST: new subitem
            const postSubitemConfig = postConfigWithVariables(
              postSubitemPCQuery,
              vars,
            );
            console.log('postSubitemConfig', postSubitemConfig);
            return axios.request(postSubitemConfig);
          })
          .then((response) => {
            console.log('response ****************************');
            console.log('response', response.data);
          })
          .catch((error) => {
            console.log(
              'error ***************************************************************',
              error,
            );
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
        return requestBody;
        // body is parsed by NestJS
      }
    }
  }
}

// post new label to time tracking board
// const graphqlPostCoLabelValue = returnChangeSimpleValueQuery(
//   TIMETRACKING_ITEM_FORLABEL,
//   variables.TIMETRACKING_PROJECT_COL,
//   variables.TIMETRACKING_BOARD,
//   itemName,
// );
// let configPostColLabelValue = returnPostConfig(
//   graphqlPostCoLabelValue,
// );
// return axios.request(configPostColLabelValue);

//TODO: this fails because board isnt fully loaded
//get id of actual value item
//             const getSellPriceItemQuery = returnGetItemFromBoardQuery(
//               newBoardId,
//               'name',
//               'Sell Price',
//             );
//             const getSellPriceItemConfig = returnGetConfig(
//               getSellPriceItemQuery,
//             );
//             console.log('getSellPriceItemConfig', getSellPriceItemConfig);
//             return axios.request(getSellPriceItemConfig);
//           })
//           .then((sellPriceItemResponse) => {
//             console.log('sellPriceItemResponse ****************************');
//             console.log(
//               'sellPriceItemResponse.data',
//               sellPriceItemResponse.data,
//             );
//             console.log(
//               'sellPriceItemResponse.data.data.boards[0]',
//               sellPriceItemResponse.data.data.boards[0],
//             );

//             console.log(
//               'sellPriceItemResponse.data.data.boards[0].items_page',
//               sellPriceItemResponse.data.data.boards[0].items_page,
//             );

//             console.log(
//               'sellPriceItemResponse.data.data.boards[0].items_page.items[0]',
//               sellPriceItemResponse.data.data.boards[0].items_page.items[0],
//             );

//             //parse items data
//             sellPriceItemId =
//               sellPriceItemResponse.data.data.boards[0].items_page.items[0]
//                 .id;
//             console.log('sellPriceItemId', sellPriceItemId);

//             const getEstimatedCostItemQuery = returnGetItemFromBoardQuery(
//               newBoardId,
//               'name',
//               'Estimated Cost',
//             );
//             const getEstimatedCostItemConfig = returnGetConfig(
//               getEstimatedCostItemQuery,
//             );
//             console.log(
//               'getEstimatedCostItemConfig',
//               getEstimatedCostItemConfig,
//             );
//             return axios.request(getEstimatedCostItemConfig);
//           })
//           .then((getEstimatedCostItem) => {
//             console.log('getEstimatedCostItem ****************************');
//             console.log(
//               'getEstimatedCostItem.data.data.boards[0].items_page.items[0]',
//               getEstimatedCostItem.data.data.boards[0].items_page.items[0],
//             );
//             console.log(
//               'getEstimatedCostItem.data.data.boards[0].items_page.items[0].id',
//               getEstimatedCostItem.data.data.boards[0].items_page.items[0].id,
//             );
//             estimatedCostItemId =
//               getEstimatedCostItem.data.data.boards[0].items_page.items[0].id;
//             console.log('estimatedCostItemId', estimatedCostItemId);

//             const changeSellPriceQuery = returnChangeSimpleValueQuery(
//               newBoardId,
//               newCostColumnId,
//               sellPriceItemId,
//               sellPrice,
//             );
//             const changeSellPriceConfig = returnPostConfig(
//               changeSellPriceQuery,
//             );
//             console.log('changeSellPriceConfig', changeSellPriceConfig);
//             return axios.request(changeSellPriceConfig);
//           })
//           .then((response) => {
//             console.log('response ****************************');
//             console.log('response', response.data);
//           })
//           .catch((error) => {
//             console.log(
//               'error ***************************************************************',
//               error,
//             );
//             console.log('error.data', error.data);
//           });

//         //event info has information regarding only the value of this particular column information
//         //make a get request: get all information regarding this item
//       } else {
//         //if there is not an event field on the body
//         //it's the verification request
//         console.log('no event:', data);
//         const requestBody = JSON.stringify({
//           challenge: `${data.challenge}`,
//         });
//         return requestBody;
//         // body is parsed by NestJS
//       }
//     }
//   }
// }
