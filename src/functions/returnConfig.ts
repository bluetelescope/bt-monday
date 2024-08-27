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

export function postConfigWithVariables(testBody: any, vars: any) {
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
