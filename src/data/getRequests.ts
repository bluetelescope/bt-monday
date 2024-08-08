export const graphqlGetBoards = JSON.stringify({
  query:
    'query {\n  boards (\n    limit: 1000\n    workspace_ids: [1080416]\n  ) {name  board_folder_id } \n}\n',
});

export let configGetBoards = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.monday.com/v2',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.MONDAY_AUTH}`,
    Cookie:
      '__cf_bm=m8zc61.IT0xf6oKWKbBo0QWuPhgxPFUC1dW87JwdnpE-1723044832-1.0.1.1-jUOMtZtUcNVOa.AdRWzi6gzMAurMpB6iDfAZol1F8eKTorhtD5fLHGey_bZSPocyVGvoqr2OMshqhyFugxndrzYrXfWvJml80MJlgJOvxY8',
  },
  data: graphqlGetBoards,
};

export const graphqlGetUsers = JSON.stringify({
  query:
    'query {\n  users (\n    limit:50\n  ) {name id is_admin teams {id name}} \n}\n',
});

export let configGetUsers = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.monday.com/v2',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.MONDAY_AUTH}`,
    Cookie:
      '__cf_bm=m8zc61.IT0xf6oKWKbBo0QWuPhgxPFUC1dW87JwdnpE-1723044832-1.0.1.1-jUOMtZtUcNVOa.AdRWzi6gzMAurMpB6iDfAZol1F8eKTorhtD5fLHGey_bZSPocyVGvoqr2OMshqhyFugxndrzYrXfWvJml80MJlgJOvxY8',
  },
  data: graphqlGetItem,
};
