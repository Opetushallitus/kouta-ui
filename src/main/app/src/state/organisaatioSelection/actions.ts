import { createAction } from '@reduxjs/toolkit';

export const SET_ORGANISAATIO = 'organisaatioSelection/SET_ORGANISAATIO';

export const setOrganisaatio = createAction<string>(SET_ORGANISAATIO);
