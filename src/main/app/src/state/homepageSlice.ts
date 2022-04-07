import { createSlice } from '@reduxjs/toolkit';
import _fp from 'lodash/fp';

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
      console.log({ items });
      state[name].selection = _fp.uniqBy(
        _fp.prop('oid'),
        [...state[name].selection, ...items].filter(Boolean)
      );
    },
    deselectItems: (state, { payload: { name, items = [] } }) => {
      state[name].selection = _fp.remove(
        (item: any) => items.find(({ oid }) => oid === item?.oid),
        state[name].selection
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
