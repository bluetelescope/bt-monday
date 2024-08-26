//creates new board based off of a template
export function returnPostBoardQuery(
  TEMPLATE_BOARD: number,
  itemName: string,
  ACTIVE_FOLDER: number,
  PROD_WORKSPACE: number,
  ownerIds: any,
  subscriberIds: any,
  ownerTeamID: number,
  subscriberTeamID: number,
) {
  return JSON.stringify({
    query: `mutation{\n create_board(  \ntemplate_id: ${TEMPLATE_BOARD}\n  board_name: \"${itemName}\"\ndescription: \"Board automatically generated from template.\"\nboard_kind: public\nfolder_id: ${ACTIVE_FOLDER}\nworkspace_id: ${PROD_WORKSPACE}\nboard_owner_ids: [${ownerIds.map((id) => `${id}`)}]\nboard_owner_team_ids: [${ownerTeamID}]\nboard_subscriber_ids: [${subscriberIds.map((id) => `${id}`)}]\nboard_subscriber_teams_ids: [${subscriberTeamID}]\nempty: false\n){id}\n\n}`,
  });
}

//returns all monday users
export function returnGetUsersQuery() {
  return JSON.stringify({
    query:
      'query {\n  users (\n    limit:50\n  ) {name id is_admin teams {id name}} \n}\n',
  });
}
//returns a single item based off it's id
export function returnGetItemQuery(itemID: number) {
  return JSON.stringify({
    query: `query {\n  items(limit: 1, ids: [${itemID}]) {\n    column_values {\n  id \n   value\n    text \n  column {\n        title\n      }\n    }\n    name\n    subscribers {\n      id\n      \n    }\n  }\n}`,
  });
}

//returns all the boards in a workspace
export function returnGetBoardsQuery(workspaceID: number) {
  return JSON.stringify({
    query: `query {\n  boards (\n    limit: 1000\n    workspace_ids: [${workspaceID}]\n  ) {id name  board_folder_id } \n}\n`,
  });
}

//returns all the groups in board
export function returnGetBoardGroupsQuery(boardId: number) {
  return JSON.stringify({
    query: `query {\n  boards(\n    ids: [${boardId}]\n  ) {\n    groups { id title}\n  }\n}`,
  });
}

//duplicates an item in a board
export function returnDuplicateItemQuery(itemID: number, boardID: number) {
  return JSON.stringify({
    query: `mutation {\n duplicate_item(\n    item_id: ${itemID}\n        board_id: ${boardID}\n      ) {\n  id\n  name\n  }\n}`,
  });
}

//returns first 25 items in a board
export function returnTop25ItemsinBoardQuery(boardID: number) {
  return JSON.stringify({
    query: `query \n{ boards (ids: [${boardID}]){\n  items_page {items {id name}}\n}\n}`,
  });
}

//returns all columns in a board
export function returnColumnsInBoard(boardID: number) {
  return JSON.stringify({
    query: `query \n{ boards (ids: [${boardID}]){\n  columns {title id}\n}\n}`,
  });
}
//changes a simple value in a column in an item
export function returnChangeSimpleValueQuery(
  boardID: number,
  colID: string,
  item_id: number,
  value: string,
) {
  return JSON.stringify({
    query: `mutation {\n  change_simple_column_value(\n  item_id: ${item_id}\n    board_id: ${boardID}\n    column_id:  \"${colID}\"\n  value: \"${value}\"\n create_labels_if_missing: true \n  ){name}\n}`,
  });
}

//returns an item in a board based off of a column value
export function returnGetItemFromBoard(
  boardID: number,
  colID: string,
  valueToSearchFor: string,
) {
  return JSON.stringify({
    query: `query { boards (ids: [${boardID}]){  items_page (limit: 1, query_params: {rules: [{column_id: \"${colID}\", compare_value: [\"${valueToSearchFor}\"]}]}){items {id name}}}}\n`,
  });
}

//returns all items in a board based off of a column value
export function returnGetItemsFromBoard(
  boardID: number,
  colID: string,
  valueToSearchFor: string,
) {
  return JSON.stringify({
    query: `query { boards (ids: [${boardID}]){  items_page (limit: 500, query_params: {rules: [{column_id: \"${colID}\", compare_value: [\"${valueToSearchFor}\"]}]}){items {id name}}}}\n`,
  });
}

//get all columns values for 500 items, includes detailed column values
export function returnGetAllItemsFromBoard(boardID: number) {
  return JSON.stringify({
    query: `query {\n  boards(ids: [${boardID}]) {\n    items_page(\n      limit: 500\n    ) {\n      items {\n        name\n        column_values {\n          id\n          type\n          text\n          value\n  \n        }\n      }\n    }\n  }\n}`,
  });
}

//get all items and thier updates on a board
export function returnGetAllItemsUpdatesFromBoard(boardID: number) {
  return JSON.stringify({
    query: `query  {\n  boards (ids: ${boardID} ) {\n    groups {\n      title\n      id\n      items_page {\n        items { name updates {text_body created_at}}\n    }\n    }}\n}`,
  });
}

export function returnAddSubitem(
  personItemID,
  itemDescription: string,
  hoursColID,
  hours,
  timelineColID,
  startDate,
  endDate,
  changedAt,
  personID,
  costColID,
  cost,
) {
  return JSON.stringify({
    query: `mutation {\n  create_subitem(\n    parent_item_id: ${personItemID}\n    item_name: \"${itemDescription || 'Hours Log'}\"\n    column_values:\"{\n  \"${hoursColID}\": \"${hours}\",\n  \"${timelineColID}\": {\n    \"to\": \"${startDate}\",\n    \"from\": \"${endDate}\",\n    \"changed_at\": \"${changedAt}\"\n  },\n  \"person\": {\n    \"personsAndTeams\": [\n      {\n        \"id\": ${personID},\n        \"kind\": \"person\"\n      }\n    ]\n  },\n  \"${costColID}\": \"${cost}\"\n}"\n    create_labels_if_missing: true\n) {\n  id\n  name\n  column_values {value text id column {title}}\n}\n}`,
    // query: `mutation {\n  create_subitem(\n    parent_item_id: 7263412897\n    item_name: \"Hours Log\"\n    column_values:\"{\\n  \\\"hours__1\\\": \\\"4\\\",\\n  \\\"timeline3__1\\\": {\\n    \\\"to\\\": \\\"2024-04-26\\\",\\n    \\\"from\\\": \\\"2024-04-22\\\",\\n    \\\"changed_at\\\": \\\"2024-08-23T00:09:08.595Z\\\"\\n  },\\n  \\\"person\\\": {\\n    \\\"personsAndTeams\\\": [\\n      {\\n        \\\"id\\\": 27253155,\\n        \\\"kind\\\": \\\"person\\\"\\n      }\\n    ]\\n  },\\n  \\\"cost__1\\\": \\\"5\\\"\\n}\"\n    \n    create_labels_if_missing: true\n) {\n  id\n  name\n  column_values {value text id column {title}}\n}\n}`,
  });
}
