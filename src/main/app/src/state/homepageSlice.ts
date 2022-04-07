import { createSlice } from '@reduxjs/toolkit';
import _fp from 'lodash';

import { ENTITY } from '#/src/constants';

const initialState = {
  [ENTITY.KOULUTUS]: {
    selection: [],
    pagination: {},
  },
  [ENTITY.TOTEUTUS]: {
    selection: [],
    pagination: {},
  },
  [ENTITY.HAKU]: {
    selection: [],
    pagination: {},
  },
  [ENTITY.HAKUKOHDE]: {
    selection: [],
    pagination: {},
  },
  [ENTITY.VALINTAPERUSTE]: {
    selection: [],
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
    selectItems: (state, { payload: { name, items = [] } }) => {
      state[name].selection = _fp.uniq(
        [...state[name].selection, ...items].filter(Boolean)
      );
    },
    deselectItems: (state, { payload: { name, items = [] } }) => {
      state[name].selection = state[name].selection.filter(
        item => !items.includes(item)
      );
    },
    removeSelection: (state, { payload: { name } }) => {
      state[name].selection = [];
    },
  },
});

export default homepageSlice.reducer;

export const { setPagination, selectItems, deselectItems, removeSelection } =
  homepageSlice.actions;

export const getSelection = name => state =>
  state.homepage?.[name]?.selection ?? [];

export const getPagination = name => state =>
  state.homepage[name].pagination || { nimi: '', page: 0 };
