import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import { returnGetConfig, returnPostConfig } from 'src/functions/returnConfig';
import {
  returnGetBoardsQuery,
  returnColumnsInBoard,
  returnChangeSimpleValueQuery,
  returnGetItemQuery,
  returnGetItemFromBoard,
  returnAddSubitem,
  returnColumnsInSubitem,
} from 'src/functions/returnQuery';
import {
  parseValueofColumnFromColumnID,
  parseColumnsForIDS,
  parseBoardIDFromSlug,
  parseColumnValuesForString,
} from 'src/functions/parseData';

// import * as process from 'process';
import axios from 'axios';

import { users, variables } from 'src/variables';

let hoursFromForm = '0';
let personId = '';
let personData;
let rate = 0;
let cost;
let label = ' ';
let boardId = 0;
let itemIDinBoard;
let costColumnId = '';
let hoursColumnId = '';
let subitemCostColumnId = '';
let subitemHoursColumnId = '';
let subitemTimelineColumnId = '';

let currentCostValue = '';
let currentHoursValue = '';
let newCostValue = '';
let newHoursValue = '';
let boardSlug;
let timelineColId;
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

          label = formData.dropdown.chosenValues[0].name;
          dateRangeData = formData.date_range;
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

          cost = `${Number(hoursFromForm) * Number(rate) * -1}`;
          console.log('cost', cost);
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

              costColumnId = parseColumnValuesForString(columns, 'Cost');
              hoursColumnId = parseColumnValuesForString(columns, 'Hours');
              timelineColId = parseColumnValuesForString(
                columns,
                'Hours Timeline',
              );
              console.log('costColumnId', costColumnId);
              console.log('hoursColumnId', hoursColumnId);
              console.log('timelineColId', timelineColId);
              subitemCostColumnId = costColumnId.split('subitems_').pop();
              subitemHoursColumnId = hoursColumnId.split('subitems_').pop();
              subitemTimelineColumnId = timelineColId.split('subitems_').pop();

              //TODO: replace getting the item and replacing the entries with create new subitem
              let query5 = `mutation ($columnVals: JSON!,) { create_subitem(parent_item_id: ${itemIDinBoard},item_name: "Hours Log",create_labels_if_missing: true, column_values:$columnVals) { id } }`;
              let testing = {
                person: {
                  personsAndTeams: [{ id: personId, kind: 'person' }],
                },
              };

              testing[`${subitemCostColumnId}`] = cost;
              testing[`${subitemHoursColumnId}`] = hoursFromForm;
              testing[`${subitemTimelineColumnId}`] = {
                to: dateRangeData.to,
                from: dateRangeData.from,
                changed_at: dateRangeData.changed_at,
              };

              let vars = {
                columnVals: JSON.stringify(testing),
              };

              function testConfig(testBody: any, vars: any) {
                return {
                  method: 'post',
                  maxBodyLength: Infinity,
                  url: 'https://api.monday.com/v2',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.MONDAY_AUTH}`,
                    Cookie:
                      '__cf_bm=m8zc61.IT0xf6oKWKbBo0QWuPhgxPFUC1dW87JwdnpE-1723044832-1.0.1.1-jUOMtZtUcNVOa.AdRWzi6gzMAurMpB6iDfAZol1F8eKTorhtD5fLHGey_bZSPocyVGvoqr2OMshqhyFugxndrzYrXfWvJml80MJlgJOvxY8',
                  },
                  data: { query: testBody, variables: vars },
                };
              }

              //POST: new subitem
              const postSubitemConfig = testConfig(query5, vars);
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
