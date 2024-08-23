function returnCreateTimetrackSubitemJSON(
  hoursID,
  hours,
  costID,
  cost,
  personID,
  fromTime,
  toTime,
  changeTime,
) {
  const string = JSON.stringify({
    hoursid1: 'hoursNUM1',
    timelineid: { to: 'toTime', from: 'fromTime', changed_at: 'changeTime' },
    person: {
      personsAndTeams: [
        {
          id: personID,
          kind: 'person',
        },
      ],
    },
    costid: 'hoursNUM2',
  });

  const updatedString = string
    .replace('hoursid1', hoursID)
    .replace('hoursNUM1', hours)
    .replace('costid', costID)
    .replace('hoursNUM2', cost)
    .replace('fromTime', fromTime)
    .replace('changeTime', changeTime)
    .replace('toTime', toTime);

  console.log('updatedString', updatedString);

  const thing = `{\n  \"hours__1\": \"4\",\n  \"timeline3__1\": {\n    \"to\": \"2024-04-26\",\n    \"from\": \"2024-04-22\",\n    \"changed_at\": \"2024-08-23T00:09:08.595Z\"\n  },\n  \"person\": {\n    \"personsAndTeams\": [\n      {\n        \"id\": 27253155,\n        \"kind\": \"person\"\n      }\n    ]\n  },\n  \"cost__1\": \"5\"\n}`;

  return updatedString;
}
