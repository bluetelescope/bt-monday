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

export function parseBoards(boards: any, activeProjFolderId: number) {
  //   console.log('-----------------------------parse boards called');

  const activeProdBoards = boards.filter(
    (board) => Number(board.board_folder_id) === Number(activeProjFolderId),
  );
  function compareNumbers(a, b) {
    return a - b;
  }

  const numbers = activeProdBoards
    .map((board) => board.name.substring(0, 4))
    .filter((name) => name[0] === 1 || name[0] === '1')
    .sort(compareNumbers);

  const biggestNumber = numbers[numbers.length - 1];
  //   console.log('-----------------------------numbers', numbers);
  //   console.log('-----------------------------biggestNumber', biggestNumber);
  return Number(biggestNumber) + 1;
}

export function parseUsers() {}
