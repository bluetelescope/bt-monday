export function parseColumnValues(columnData: any) {
  let columnScaffolds = [
    { name: 'proposal', string: 'Proposal', value: '' },
    { name: 'estRevenue', string: 'Est Revenue', value: '' },
    { name: 'forecastValue', string: 'Forecast Value', value: '' },
    { name: 'actualProjectValue', string: 'Project Value', value: '' },
    { name: 'costOfProd', string: 'Cost of Production', value: '' },
    { name: 'files', string: 'Files', value: '' },
    { name: 'gDrive', string: '(G-Drive)', value: '' },
    { name: 'boards', string: 'Project Value', value: '' },
  ];

  const newArray = columnScaffolds.map((columnScaffold) => {
    const value = columnData.filter((column) => {
      return column.column.title.includes(columnScaffold.string);
    })[0].value;

    return {
      name: columnScaffold.name,
      string: columnScaffold.string,
      value: value,
    };
  });

  return newArray;
}

export function parseBoards() {}

export function parseUsers() {}
