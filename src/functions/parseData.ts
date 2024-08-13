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

export function parseUsers(usersArray: any) {
  function teamIsProd(teamArray: any) {
    const isProd = teamArray.filter(
      (teamName) => teamName.name === 'Producers / PM',
    );
    console.log('isProd', isProd);
    if (isProd.length !== 0) {
      return true;
    } else {
      return false;
    }
  }
  const adminUsers = usersArray
    .filter((user) => user.is_admin)
    .map((user) => user.id);
  const prodTeam = usersArray
    .filter((user) => teamIsProd(user.teams))
    .map((user) => user.id);

  return { adminUsers, prodTeam };
}

export function parseBoardID(boards: any, label: string) {
  const board = boards.filter((board) => board.name === label)[0];
  console.log('board', board);
  return board.id;
}

export function parseItemID(users: any, items: any, personID: string) {
  const foundUser = users.filter((user) => user.id === String(personID))[0];
  console.log('foundUser', foundUser);
  const foundItem = items.filter((item) => item.name === foundUser.title)[0];
  console.log('foundItem', foundItem);
  return foundItem.id;
}
