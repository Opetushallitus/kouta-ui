export const getPagination = name => state =>
  state.pagination[name] || { nimi: '', page: 0 };
