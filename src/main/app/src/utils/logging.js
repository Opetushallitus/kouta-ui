
const getLogMessages = () => {
  const messagesJson = localStorage.getItem('logger');
  if (messagesJson) {
    return JSON.parse(messagesJson)
  }
  return [];
};

export const logEvent = (message) => {
  const logMessages = getLogMessages();
  logMessages.push(message);
  const messagesJson = JSON.stringify(logMessages);
  localStorage.setItem('logger', messagesJson);
}

export const clearEventLog = () => {
  localStorage.setItem('logger', JSON.stringify([]));
}

export const logResult = (object, message) => {
  console.log(message, object);
  return object;
}
