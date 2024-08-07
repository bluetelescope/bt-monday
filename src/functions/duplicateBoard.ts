import axios from 'axios';

export default function duplicateBoard() {
  const axios = require('axios');

  const graphql = JSON.stringify({
    query:
      'mutation{\n create_board(  \ntemplate_id: 6198096739\n  board_name: "Testing"\ndescription: "board created as test for automation"\nboard_kind: public\nfolder_id: 7860571\nworkspace_id: 1080416\nboard_owner_ids: [37385671]\nboard_owner_team_ids: [614284]\nboard_subscriber_ids: [37385671]\nboard_subscriber_teams_ids: [614284]\nempty: false\n){id}\n\n}',
  });

  let config = {
    method: 'post',
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
