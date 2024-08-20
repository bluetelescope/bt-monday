import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import { returnGetConfig, returnPostConfig } from 'src/functions/returnConfig';
import {
  returnGetBoardsQuery,
  returnColumnsInBoard,
  returnChangeSimpleValueQuery,
  returnGetItemQuery,
  returnGetItemFromBoard,
} from 'src/functions/returnQuery';
import {
  parseValueofColumnFromColumnID,
  parseColumnsForIDS,
  parseBoardIDFromSlug,
} from 'src/functions/parseData';

// import * as process from 'process';
import axios from 'axios';

import { users, variables } from 'src/variables';

let hoursFromForm = '0';
let personId = '';
let personData;
let rate = 0;
let label = ' ';
let boardId = 0;
let itemIDinBoard;
let costColumnId = '';
let hoursColumnId = '';
let currentCostValue = '';
let currentHoursValue = '';
let newCostValue = '';
let newHoursValue = '';
let boardSlug;

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
        if (
          data.event.type === 'create_pulse' &&
          !!data.event.columnValues &&
          data.event.groupName !== 'Active Projects'
        ) {
          console.log(
            'event is create pulse ****************************************************',
          );
          //parse time tracking data
          const formData = data.event.columnValues;
          label = formData.dropdown.chosenValues[0].name;
          boardSlug = label.substring(0, 4);
          personId = String(formData.person.personsAndTeams[0].id);
          console.log('personId', personId);
          personData = users.filter(
            (person) => person.id === String(personId),
          )[0];
          console.log('personData', personData);
          hoursFromForm = formData.numbers.value;
          console.log('personId', personId);
          console.log('label', formData.dropdown.chosenValues[0].name);
          console.log('hoursFromForm', hoursFromForm);
          //parse users data
          // rate = parseRatefromUserID(users, personId);
          rate = personData.rate;
          console.log('rate', rate);

          //get: boards query
          const graphqlGetBoards = returnGetBoardsQuery(
            variables.PROD_WORKSPACE,
          );
          const getBoardsQuery = returnGetConfig(graphqlGetBoards);
          axios
            .request(getBoardsQuery)
            .then((resGetBoards) => {
              console.log(
                'resGetBoardsQuery *****************************************************************',
              );
              //parse boards data

              boardId = parseBoardIDFromSlug(
                resGetBoards.data.data.boards,
                boardSlug,
              );

              //GET: item in active project board with persons name
              const getBoardItemQuery = returnGetItemFromBoard(
                boardId,
                'name',
                personData.title,
              );
              const getBoardItemCofig = returnGetConfig(getBoardItemQuery);
              return axios.request(getBoardItemCofig);
            })
            .then((getBoardItemRes) => {
              console.log(
                'getBoardItemsRes *****************************************************************',
              );
              // console.log('getBoardItemsRes.data', getBoardItemsRes.data);
              //parse items data
              itemIDinBoard =
                getBoardItemRes.data.data.boards[0].items_page.items[0].id;

              //GET: columns in active project
              const getBoardColumnsQuery = returnColumnsInBoard(boardId);
              const getBoardColumnsConfig =
                returnGetConfig(getBoardColumnsQuery);
              return axios.request(getBoardColumnsConfig);
            })
            .then((getBoardColumnsRes) => {
              console.log(
                'getBoardColumnsRes *****************************************************************',
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
              console.log(
                'getItemRes *****************************************************************',
              );
              //parse item data
              // console.log('getItemRes.data', getItemRes.data.data);
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
              newCostValue = `${Number(newHoursValue === null ? 0 : newHoursValue) * Number(rate) * -1}`;
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
