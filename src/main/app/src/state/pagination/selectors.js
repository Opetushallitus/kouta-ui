export const getPagination = name => state =>
  state.pagination[name] || { page: 0 };
