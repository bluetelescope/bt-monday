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

export function returnGetUsersQuery() {
  return JSON.stringify({
    query:
      'query {\n  users (\n    limit:50\n  ) {name id is_admin teams {id name}} \n}\n',
  });
}
export function returnGetItemQuery(itemID: number) {
  return JSON.stringify({
    query: `query {\n  items(limit: 1, ids: [${itemID}]) {\n    column_values {\n      value\n      column {\n        title\n      }\n    }\n    name\n    subscribers {\n      id\n      \n    }\n  }\n}`,
  });
}
export function returnGetBoardsQuery(workspaceID: number) {
  return JSON.stringify({
    query: `query {\n  boards (\n    limit: 1000\n    workspace_ids: [${workspaceID}]\n  ) {name  board_folder_id } \n}\n`,
  });
}

export function returnGetBoardGroupsQuery(boardId: number) {
  return JSON.stringify({
    query: `query {\n  boards(\n    ids: [${boardId}]\n  ) {\n    groups { id title}\n  }\n}`,
  });
}

export function returnPostTimetrackLabelQuery(
  itemID: number,
  columnID: string,
  boardID: number,
  value: string,
) {
  return JSON.stringify({
    query: `mutation {\n  change_simple_column_value(\n    item_id: ${itemID}\n    column_id: \"${columnID}\",\n    board_id: ${boardID}\n    create_labels_if_missing:true\n    value: \"${value}\"\n  ) {\n    name\n  }\n}`,
  });
}

export function returnPostTimetrackItemQuery(itemID: number, boardID: number) {
  return JSON.stringify({
    query: `mutation {\n duplicate_item(\n    item_id: ${itemID}\n        board_id: ${boardID}\n      ) {\n    name\n  }\n}`,
  });
}
