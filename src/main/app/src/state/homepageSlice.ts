import { createSlice } from '@reduxjs/toolkit';

import { ENTITY } from '#/src/constants';

const initialState = {
  [ENTITY.KOULUTUS]: {
    pagination: {},
  },
  [ENTITY.TOTEUTUS]: {
    pagination: {},
  },
  [ENTITY.HAKU]: {
    pagination: {},
  },
  [ENTITY.HAKUKOHDE]: {
    pagination: {},
  },
  [ENTITY.VALINTAPERUSTE]: {
    pagination: {},
  },
};

export const homepageSlice = createSlice({
  name: 'homepage',
  initialState,
  reducers: {
    setPagination: (state, { payload: { name, ...pagination } }) => {
      state[name].pagination = { ...state[name].pagination, ...pagination };
    },
  },
});

export default homepageSlice.reducer;

export const { setPagination } = homepageSlice.actions;

export const getPagination = name => state =>
  state.homepage[name].pagination || { nimi: '', page: 0 };
