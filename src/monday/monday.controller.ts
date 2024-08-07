import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import getVariables from 'src/functions/getVariables';
import getItemInfo from 'src/functions/getItemInfo';
// import * as process from 'process';
import axios from 'axios';

const TEMPLATE_BOARD = 6198096739;
const PIPELINE_BOARD = 5552219681;
const TIMETRACKING_BOARD = 5872168554;
const PROD_WORKSPACE = 1080416;
const BIZDEV_WORKSPACE = 3839751;
const MIDLEVEL_FOLDER = 14770065;
const ACTIVE_FOLDER = 7860571;

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

  // POST validate
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
        const graphql = JSON.stringify({
          query:
            'query {\n  items(limit: 1, ids: [5104037469]) {\n    column_values {\n      value\n      column {\n        title\n      }\n    }\n    name\n    subscribers {\n      id\n      \n    }\n  }\n}',
        });
        let configGetItem = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'https://api.monday.com/v2',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MONDAY_AUTH}`,
            Cookie:
              '__cf_bm=m8zc61.IT0xf6oKWKbBo0QWuPhgxPFUC1dW87JwdnpE-1723044832-1.0.1.1-jUOMtZtUcNVOa.AdRWzi6gzMAurMpB6iDfAZol1F8eKTorhtD5fLHGey_bZSPocyVGvoqr2OMshqhyFugxndrzYrXfWvJml80MJlgJOvxY8',
          },
          data: graphql,
        };

        // axios
        //   .request(configGetItem)
        //   .then((response) => {
        //     console.log('*********************************response to get 1');

        //     const responseData = response.data.data.items[0];
        //     const itemName = responseData.name;
        //     //Hadley_Colored Musicians Club
        //     const subscribers = responseData.subscribers;
        //     //[ { id: '23774585' }, { id: '26473580' } ]
        //     const columns = responseData.column_values;

        //     const proposal = columns.filter((column) => {
        //       return column.column.title.includes('Proposal');
        //     })[0].value;
        //     const estRevenue = columns.filter((column) => {
        //       return column.column.title.includes('Est Revenue');
        //     })[0].value;
        //     const forecastValue = columns.filter((column) => {
        //       return column.column.title.includes('Forecast Value');
        //     })[0].value;
        //     const actualProjectValue = columns.filter((column) => {
        //       return column.column.title.includes('Project Value');
        //     })[0].value;
        //     const costOfProd = columns.filter((column) => {
        //       return column.column.title.includes('Cost of Production');
        //     })[0].value;
        //     const files = columns.filter((column) => {
        //       return column.column.title.includes('Files');
        //     })[0].value;
        //     const gDrive = columns.filter((column) => {
        //       return column.column.title.includes('(G-Drive)');
        //     })[0].value;
        //   })
        //   .catch((error) => {
        //     console.log('*********************************response');
        //     console.log(error);
        //   });

        axios
          .request(configGetItem)
          .then((response) => {
            console.log(
              'response get ***************************************************',
            );
            const responseData = response.data.data.items[0];
            const itemName = responseData.name;
            //Hadley_Colored Musicians Club
            const subscribers = responseData.subscribers;
            //[ { id: '23774585' }, { id: '26473580' } ]
            const columns = responseData.column_values;

            const proposal = columns.filter((column) => {
              return column.column.title.includes('Proposal');
            })[0].value;
            const estRevenue = columns.filter((column) => {
              return column.column.title.includes('Est Revenue');
            })[0].value;
            const forecastValue = columns.filter((column) => {
              return column.column.title.includes('Forecast Value');
            })[0].value;
            const actualProjectValue = columns.filter((column) => {
              return column.column.title.includes('Project Value');
            })[0].value;
            const costOfProd = columns.filter((column) => {
              return column.column.title.includes('Cost of Production');
            })[0].value;
            const files = columns.filter((column) => {
              return column.column.title.includes('Files');
            })[0].value;
            const gDrive = columns.filter((column) => {
              return column.column.title.includes('(G-Drive)');
            })[0].value;

            const graphqlPost = JSON.stringify({
              query: `mutation{\n create_board(  \ntemplate_id: ${TEMPLATE_BOARD}\n  board_name: \"${itemName}\"\ndescription: \"Board automatically generated from template.\"\nboard_kind: public\nfolder_id: ${ACTIVE_FOLDER}\nworkspace_id: ${PROD_WORKSPACE}\nboard_owner_ids: [37385671]\nboard_owner_team_ids: [614284]\nboard_subscriber_ids: [37385671]\nboard_subscriber_teams_ids: [614284]\nempty: false\n){id}\n\n}`,
            });

            let configPostItem = {
              method: 'post',
              maxBodyLength: Infinity,
              url: 'https://api.monday.com/v2',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.MONDAY_AUTH}`,
                Cookie:
                  '__cf_bm=m8zc61.IT0xf6oKWKbBo0QWuPhgxPFUC1dW87JwdnpE-1723044832-1.0.1.1-jUOMtZtUcNVOa.AdRWzi6gzMAurMpB6iDfAZol1F8eKTorhtD5fLHGey_bZSPocyVGvoqr2OMshqhyFugxndrzYrXfWvJml80MJlgJOvxY8',
              },
              data: graphqlPost,
            };

            console.log('configPostItem', configPostItem);
            // //make post request with data that has been put into variables above
            return axios.post(configPostItem);
          })
          .then((response) => {
            console.log(
              '*********************************response to post 1',
              response,
            );
            console.log(
              '*********************************response.data to post 1',
              response.data,
            );
          })
          .catch((error) => console.log(error.response));

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
