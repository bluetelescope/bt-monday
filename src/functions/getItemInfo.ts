import axios from 'axios';
import * as process from 'process';

export default function getItemInfo() {
  const axios = require('axios');

  const graphql = JSON.stringify({
    query:
      'query {\n  items(limit: 1, ids: [5104037469]) {\n    column_values {\n      value\n      column {\n        title\n      }\n    }\n    name\n    subscribers {\n      id\n      \n    }\n  }\n}',
  });

  let config = {
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

  console.log(
    'config*************************************************************************',
    config,
  );
  axios
    .request(config)
    .then((response) => {
      console.log('*********************************response');
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log('*********************************response');

      console.log(error);
    });
}
