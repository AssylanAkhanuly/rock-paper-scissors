export const copyObj = (obj) => {
  let newObj = {};
  for (let key in obj) newObj[key] = obj[key];

  return newObj;
};

export const tryParseMessage = (message) => {
  let parsedMessage = message;

  if (isJsonString(message)) parsedMessage = JSON.parse(message);
  if (isJsonString(message?.utf8Data))
    parsedMessage = JSON.parse(message.utf8Data);

  return parsedMessage;
};

export const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const isOriginAllowed = (origin) => {
  return true;
};

export const checkProtocol = (request) => {
  if (!isOriginAllowed(request.origin)) {
    request.reject();
    return;
  }
  return request.accept("echo-protocol", request.origin);
};

export const whoWin = (users) => {
  let winners,
    loosers = [];

  const selections = [...new Set(users.map((user) => user.data.selection))];

  console.log("selections:", selections);
  console.log("include function: ", selections.includes(0));

  if (selections.length === 1) return { winners, loosers, isTie: true };
  else if (selections.length === 2 && selections.includes(0)) {
    return {
      winners: users.filter((user) => user.data.selection),
      loosers: users.filter((user) => !user.data.selection),
      isTie: false,
    };
  }

  const filteredSelections = selections.filter((selection) => selection);

  if (filteredSelections.length === 3) return { winners, loosers, isTie: true };

  const sum = filteredSelections.reduce((acc, selection) => {
    return acc + selection;
  }, 0);

  const max = Math.max(...filteredSelections);
  const min = Math.min(...filteredSelections);
  if (sum % 2 === 1) {
    winners = users.filter((user) => user.data.selection === max);
    loosers = users.filter((user) => user.data.selection === min);
  } else {
    winners = users.filter((user) => user.data.selection === min);
    loosers = users.filter((user) => user.data.selection === max);
  }

  return {
    loosers,
    winners,
    isTie: false,
  };
};
