export function returnGetConfig(graphqlGet: any) {
  return {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.monday.com/v2',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MONDAY_AUTH}`,
      Cookie:
        '__cf_bm=m8zc61.IT0xf6oKWKbBo0QWuPhgxPFUC1dW87JwdnpE-1723044832-1.0.1.1-jUOMtZtUcNVOa.AdRWzi6gzMAurMpB6iDfAZol1F8eKTorhtD5fLHGey_bZSPocyVGvoqr2OMshqhyFugxndrzYrXfWvJml80MJlgJOvxY8',
    },
    data: graphqlGet,
  };
}

export function testConfig(testBody: any, vars: any) {
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

export function returnPostConfig(graphqlPost: any) {
  return {
    method: 'get',
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
}

export function returnGetUsersConfig(graphqlGetUsers: any) {
  return {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.monday.com/v2',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MONDAY_AUTH}`,
      Cookie:
        '__cf_bm=m8zc61.IT0xf6oKWKbBo0QWuPhgxPFUC1dW87JwdnpE-1723044832-1.0.1.1-jUOMtZtUcNVOa.AdRWzi6gzMAurMpB6iDfAZol1F8eKTorhtD5fLHGey_bZSPocyVGvoqr2OMshqhyFugxndrzYrXfWvJml80MJlgJOvxY8',
    },
    data: graphqlGetUsers,
  };
}

export function returnGetBoardsConfig(graphqlGetBoards: any) {
  return {
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
}

export function returnGetItemConfig(graphqlGetItem: any) {
  return {
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
}

export function returnPostBoardConfig(graphqlPost: any) {
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
    data: graphqlPost,
  };
}

export function returnGetBoardGroupsConfig(graphqlPost: any) {
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
    data: graphqlPost,
  };
}

export function returnPostTimetrackLabelConfig(graphqlPost: any) {
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
    data: graphqlPost,
  };
}

export function returnPostTimetrackItemConfig(graphqlPost: any) {
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
    data: graphqlPost,
  };
}
