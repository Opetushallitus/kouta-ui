import {dispatch} from 'metamatic';

const AppState = {};

export const STATE_KOULUTUS_SELECTOR_VISIBLE = 'STATE_KOULUTUS_SELECTOR_VISIBLE';

export const showKoulutusSelector = () => {
  AppState.koulutusSelectorVisible = true;
  dispatch(STATE_KOULUTUS_SELECTOR_VISIBLE, AppState.koulutusSelectorVisible);
}