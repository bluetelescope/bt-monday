export function returnPostBoardQuery(
  TEMPLATE_BOARD: number,
  itemName: string,
  ACTIVE_FOLDER: number,
  PROD_WORKSPACE: number,
) {
  return JSON.stringify({
    query: `mutation{\n create_board(  \ntemplate_id: ${TEMPLATE_BOARD}\n  board_name: \"${itemName}\"\ndescription: \"Board automatically generated from template.\"\nboard_kind: public\nfolder_id: ${ACTIVE_FOLDER}\nworkspace_id: ${PROD_WORKSPACE}\nboard_owner_ids: [37385671]\nboard_owner_team_ids: [614284]\nboard_subscriber_ids: [37385671]\nboard_subscriber_teams_ids: [614284]\nempty: false\n){id}\n\n}`,
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
