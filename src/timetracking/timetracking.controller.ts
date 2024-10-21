import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import {
  returnGetConfig,
  postConfigWithVariables,
} from 'src/functions/returnConfig';
import {
  returnGetBoardsQuery,
  returnGetItemFromBoardQuery,
  returnColumnsInSubitem,
} from 'src/functions/returnQuery';
import {
  parseBoardIDFromSlug,
  parseSubColumnValuesForString,
} from 'src/functions/parseData';

// import * as process from 'process';
import axios from 'axios';

import { users, variables } from 'src/variables';

let hoursFromForm = '0';
let personName = '';
let personId = '';
let personData;
let rate = 0;
let actualRate = 0;
let billedRate = 0;

let cost;
let actualCost;
let billedCost;

let label = ' ';
let boardId = 0;
let itemIDinBoard;
let subitemRateColumnId = '';
let subitemActualRateColumnId = '';
let subitemBilledRateColumnId = '';
let subitemNameColumnId = '';
let subitemIsHourlyColumnId = '';
let subitemHoursColumnId = '';
let subitemTimelineColumnId = '';
let subitemNameColumnString = 'Name';
let subitemIsHourlyColumnString = 'Calculate Hourly Rate?';
let subitemActualRateColumnString = 'Actual Rate';
let subitemBilledRateColumnString = 'Billed Rate';
let subitemHoursColumnString = 'Hours';
let subitemTimelineColumnString = 'Hours Timeline';
let boardSlug;
let dateRangeData;
let itemDescription;

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
          data.event.columnValues !== undefined &&
          data.event.groupName !== 'Active Projects' &&
          data.event.columnValues.dropdown !== undefined
        ) {
          console.log(
            'event is create pulse ****************************************************',
          );
          console.log(' data.event', data.event);
          itemDescription = data.event.pulseName;
          console.log('itemDescription', itemDescription);

          //parse time tracking data
          const formData = data.event.columnValues;
          console.log('data.event.columnValues', data.event.columnValues);
          console.log(
            'data.event.columnValues.dropdown',
            data.event.columnValues.dropdown,
          );
          console.log(
            'data.event.columnValues.multi_select1__1.chosenValues',
            data.event.columnValues.multi_select1__1.chosenValues,
          );
          console.log(
            'data.event.columnValues.multi_select1__1.chosenValues[0].name',
            data.event.columnValues.multi_select1__1.chosenValues[0].name,
          );

          label = formData.dropdown.chosenValues[0].name;
          dateRangeData = formData.date_range;
          personName = formData.multi_select1__1.chosenValues[0].name;
          boardSlug = label.substring(0, 4);

          // personId = String(formData.person.personsAndTeams[0].id);
          // console.log('personId', personId);
          personData = users.filter(
            (person) => person.name === String(personName),
          )[0];
          console.log('personData', personData);
          hoursFromForm = formData.numbers.value;
          // console.log('personId', personId);
          console.log('label', formData.dropdown.chosenValues[0].name);
          console.log('hoursFromForm', hoursFromForm);
          //parse users data
          actualRate = personData.actualRate;
          billedRate = personData.billedRate;

          console.log('actualRate', actualRate);
          console.log('billedRate', billedRate);

          actualCost = `${Number(hoursFromForm) * Number(actualRate) * -1}`;
          billedCost = `${Number(hoursFromForm) * Number(billedRate) * -1}`;

          console.log('actualCost', actualCost);
          console.log('billedCost', billedCost);

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
              const getBoardItemQuery = returnGetItemFromBoardQuery(
                boardId,
                'name',
                personData.title,
              );
              console.log('getBoardItemQuery', getBoardItemQuery);
              const getBoardItemCofig = returnGetConfig(getBoardItemQuery);
              return axios.request(getBoardItemCofig);
            })
            .then((getBoardItemRes) => {
              console.log(
                'getBoardItemsRes *****************************************************************',
              );
              // console.log('getBoardItemsRes.data', getBoardItemRes.data);

              //parse items data
              itemIDinBoard =
                getBoardItemRes.data.data.boards[0].items_page.items[0].id;

              //GET: columns in subitem
              const getItemColumnsQuery = returnColumnsInSubitem(itemIDinBoard);
              const getItemColumnsConfig = returnGetConfig(getItemColumnsQuery);
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

              subitemNameColumnId = parseSubColumnValuesForString(
                columns,
                subitemNameColumnString,
              );
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
              // console.log('subitemRateColumnId', subitemRateColumnId);
              console.log(
                'subitemActualRateColumnId',
                subitemActualRateColumnId,
              );
              console.log(
                'subitemBilledRateColumnId',
                subitemBilledRateColumnId,
              );

              console.log('subitemHoursColumnId', subitemHoursColumnId);
              console.log('subitemTimelineColumnId', subitemTimelineColumnId);

              //TODO: replace getting the item and replacing the entries with create new subitem
              let postSubitemQuery = `mutation ($columnVals: JSON!,) { create_subitem(parent_item_id: ${itemIDinBoard},item_name: "Hours Log",create_labels_if_missing: true, column_values:$columnVals) { id } }`;
              let testing = {
                // person: {
                //   personsAndTeams: [{ id: personId, kind: 'person' }],
                // }
              };

              testing[`${subitemIsHourlyColumnId}`] = { label: 'YES' };
              testing[`${subitemNameColumnId}`] = personName;
              // testing[`${subitemRateColumnId}`] = rate;
              testing[`${subitemActualRateColumnId}`] = actualRate;
              testing[`${subitemBilledRateColumnId}`] = billedRate;
              testing[`${subitemHoursColumnId}`] = hoursFromForm;
              testing[`${subitemTimelineColumnId}`] = {
                to: dateRangeData.to,
                from: dateRangeData.from,
                changed_at: dateRangeData.changed_at,
              };

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

            .catch((error) => {
              console.log(
                'error ***************************************************************',
                error,
              );
            });
        } else {
          console.log(
            'ERROR: event type is not create pulse OR data.event.columnValues undefined  ***********************************************',
            'OR group name is not active projects OR data.event.columnValues.dropdown undefined  ***********************************************',
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
