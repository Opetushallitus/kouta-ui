const tryParseJson = (value, defaultValue = null) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return defaultValue;
  }
};

export default tryParseJson;
