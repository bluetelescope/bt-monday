import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import { returnGetConfig, returnPostConfig } from 'src/functions/returnConfig';
import { variables } from 'src/variables';

let devFolderID = '1Jl-R5c4PTrXQr1QGRTINwJ2R5jKbYk7t';

@Controller('google')
export class GoogleController {
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
      console.log('google body:', text);
    } else {
      console.log('google data:', data);
      //if there is an event field on the body
      if (!!data.event) {
        console.log('google.event', data.event);

        // const axios = require('axios');
        // const fs = require('fs');
        // const { GoogleAuth } = require('google-auth-library');

        // const { google } = require('googleapis');

        // const auth = new GoogleAuth({
        //   scopes: 'https://www.googleapis.com/auth/drive',
        // });
        // const service = google.drive({ version: 'v3', auth });

        // const fileMetadata = {
        //   name: 'Testing',
        //   mimeType: 'application/vnd.google-apps.folder',
        //   parents: [devFolderID],
        // };
        // try {
        //   const file = await service.files.create({
        //     requestBody: fileMetadata,
        //     fields: 'id',
        //   });
        //   console.log('Folder Id:', file.data.id);
        //   return file.data.id;
        // } catch (err) {
        //   // TODO(developer) - Handle error
        //   console.log('err', err);
        //   console.log('err.data', err.data);

        //   throw err;
        // }

        // const getUpdatesConfig = returnGetConfig();
        // axios
        //   .request(getUpdatesConfig)
        //   .then((getUpdatesResponse) => {

        //   })
        //   .catch((error) => {
        //     console.log('error.data', error.data);
        //   });

        const { auth } = require('google-auth-library');

        // load the environment variable with our keys
        const keysEnvVar = process.env.SERVICE_ACCOUNT_CREDS;
        if (!keysEnvVar) {
          throw new Error('The $CREDS environment variable was not found!');
        }
        console.log('keysEnvVar', keysEnvVar);
        const keys = JSON.parse(keysEnvVar);
        console.log('keys', keys);
        async function main() {
          // load the JWT or UserRefreshClient from the keys
          const client = auth.fromJSON(keys);
          client.scopes = ['https://www.googleapis.com/auth/cloud-platform'];
          const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
          const res = await client.request({ url });
          console.log(res.data);
        }

        main().catch(console.error);
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
