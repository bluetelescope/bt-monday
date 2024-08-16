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
  parseBoardID,
  parseValueofColumnFromColumnID,
  parseColumnsForIDS,
} from 'src/functions/parseData';

// import * as process from 'process';
import axios from 'axios';

const PROD_WORKSPACE = 1080416;

const users = [
  {
    id: '23774585',
    rate: 300,
    name: 'Trent Oliver',
    title: 'Principal + Managing Director',
  },
  {
    id: '25891866',
    rate: 190,
    name: 'Dustin Stephan',
    title: 'Sr. Creative Producer',
  },
  {
    id: '26473580',
    rate: 250,
    name: 'Judith Zissman',
    title: 'Exec. Creative Director',
  },
  {
    id: '26815252',
    rate: 175,
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
    rate: 200,
    name: 'Ron Cunningham',
    title: 'Senior Creative Technologist',
  },
  {
    id: '27397551',
    rate: 225,
    name: 'Valeria',
    title: 'Lead Creative Developer',
  },
  {
    id: '37385671',
    name: 'Carly Hayter',
    rate: 175,
    title: 'Creative Software Developer',
  },
  {
    id: '38929843',
    rate: 160,
    name: 'Patti Sande',
    title: 'Back Office Administration',
  },
  {
    id: '42467420',
    rate: 175,
    name: 'Anthony DeRita',
    title: 'Creative Producer',
  },
  {
    id: '42749849',
    rate: 175,
    name: 'Gianna Capadona',
    title: 'Creative Producer',
  },
  {
    id: '48317427',
    rate: 160,
    name: 'Renee Mancino',
    title: 'Director of Creative Growth',
  },
  {
    id: '62282324',
    rate: 160,
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

let hoursFromForm = '0';
let costFromForm = 0;
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
        // console.log(
        //   'data ******************************************************************',
        //   data,
        // );

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
          const graphqlGetBoards = returnGetBoardsQuery(PROD_WORKSPACE);
          const getBoardsQuery = returnGetConfig(graphqlGetBoards);
          axios
            .request(getBoardsQuery)
            .then((resGetBoards) => {
              console.log(
                'resGetBoardsQuery *****************************************************************',
              );
              //parse boards data

              boardId = parseBoardID(resGetBoards.data.data.boards, label);

              //GET: items in active project board
              // const getBoardItemsQuery = returnTop25ItemsinBoardQuery(boardId);
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
              console.log('getBoardItemsRes.data', getBoardItemsRes.data);
              //parse items data
              itemIDinBoard =
                getBoardItemsRes.data.data.boards[0].items_page.items[0].id;

              //GET: columns in active project
              const getBoardColumnsQuery = returnColumnsInBoard(boardId);
              const getBoardColumnsConfig =
                returnGetConfig(getBoardColumnsQuery);
              return axios.request(getBoardColumnsConfig);
            })
            .then((getBoardColumnsRes) => {
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
