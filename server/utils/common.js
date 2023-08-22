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

export const whoWin = (users) => {
  let winners = [];
  let loosers = [];

  const selections = [...new Set(users.map((user) => user.data.selection))];
  
  if (selections.length % 2) return { winners, loosers, isTie: true };

  const sum = users.reduce((acc, user) => {
    return acc + user.selection;
  }, 0);

  const max = Math.max(...selections);
  const min = Math.min(...selections);

  if (sum % 2 === 1) {
    winners = users.filter((user) => user.data.selection === min);
    loosers = users.filter((user) => user.data.selection === max);
  } else {
    winners = users.filter((user) => user.data.selection === max);
    loosers = users.filter((user) => user.data.selection === min);
  }

  return {
    loosers,
    winners,
    isTie: false,
  };
};
