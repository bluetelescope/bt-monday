import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import { returnGetConfig, returnPostConfig } from 'src/functions/returnConfig';
import {
  returnGetItemQuery,
  returnGetBoardsQuery,
  returnPostBoardQuery,
  returnChangeSimpleValueQuery,
  returnDuplicateItemQuery,
  returnGetItemFromBoard,
} from 'src/functions/returnQuery';
import { parseColumnValues, parseBoards } from 'src/functions/parseData';
import { variables } from 'src/variables';

let itemIdFromForm;
let itemName = ''; //Hadley_Colored Musicians Club
let columns = [];
let users = { adminUsers: [], prodTeam: [] };
let duplicatedItemID;
let proposalURL;
let actualProjectValue;
let newBoardId;
let newProposalColumnId = 'link';
let newCostColumnId = 'numbers__1';
let proposalItemId;
let actualValueItemId;

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

            itemName = item.name.replace('_', ' ');
            columns = item.column_values;
            const { proposal, value } = parseColumnValues(item.column_values);
            proposalURL = proposal.value.substring(
              proposal.value.indexOf('http'),
              proposal.value.length,
            );
            actualProjectValue = value.value;

            //get all boards in prod workspace
            const graphqlGetBoards = returnGetBoardsQuery(
              variables.PROD_WORKSPACE,
            );
            let configGetBoards = returnGetConfig(graphqlGetBoards);
            return axios.request(configGetBoards);
          })
          .then((responseConfigGetBoards) => {
            console.log('responseConfigGetBoards **************');
            // Parse boards data
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

            const getProposalItemQuery = returnGetItemFromBoard(
              newBoardId,
              'name',
              'Proposal',
            );
            const getProposalItemConfig = returnGetConfig(getProposalItemQuery);
            return axios.request(getProposalItemConfig);
          })
          .then((getProposalItem) => {
            console.log('getProposalItem ****************************');
            console.log(
              'getProposalItem.data',
              getProposalItem.data.data.boards[0].items_page.items[0].id,
            );
            proposalItemId =
              getProposalItem.data.data.boards[0].items_page.items[0].id;

            const getActualValueItemQuery = returnGetItemFromBoard(
              newBoardId,
              'name',
              'Proposal',
            );
            const getActualValueItemConfig = returnGetConfig(
              getActualValueItemQuery,
            );
            return axios.request(getActualValueItemConfig);
          })
          .then((getActualItemReponse) => {
            console.log('getActualItemReponse ****************************');
            console.log(
              'getActualItemReponse.data',
              getActualItemReponse.data.data.boards[0].items_page.items[0].id,
            );
            actualValueItemId =
              getActualItemReponse.data.data.boards[0].items_page.items[0].id;
            const changeProposalQuery = returnChangeSimpleValueQuery(
              newBoardId,
              newProposalColumnId,
              proposalItemId,
              `${proposalURL} Proposal`,
            );
            const changeProposalConfig = returnPostConfig(changeProposalQuery);
            return axios.request(changeProposalConfig);
          })
          .then((changeProposalResponse) => {
            console.log('changeProposalResponse ****************************');
            console.log(
              'changeProposalResponse.data',
              changeProposalResponse.data,
            );

            const changeActualValueQuery = returnChangeSimpleValueQuery(
              newBoardId,
              newCostColumnId,
              actualValueItemId,
              actualProjectValue,
            );
            const changeActualValueConfig = returnPostConfig(
              changeActualValueQuery,
            );
            return axios.request(changeActualValueConfig);
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
