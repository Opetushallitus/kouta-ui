import {clearState, handleEvents, initStates, setState} from '../../utils/stateUtils';

export const APP_STATE_HAUN_HAKUTAPA_OPTIONS = 'APP_STATE_HAUN_HAKUTAPA_OPTIONS';
export const APP_STATE_HAUN_HAKUTAPA_SELECTIONS = 'APP_STATE_HAUN_HAKUTAPA_SELECTIONS';
export const APP_EVENT_HAUN_HAKUTAPA_SELECTION_CHANGE = 'APP_EVENT_HAUN_HAKUTAPA_SELECTION_CHANGE';
export const APP_EVENT_HAUN_HAKUTAPA_SELECTION_CLEAR = 'APP_EVENT_HAUN_HAKUTAPA_SELECTION_CLEAR';

export const HaunHakutapaStore = () => {
  handleEvents({
    [APP_EVENT_HAUN_HAKUTAPA_SELECTION_CHANGE]: (selection) => selectHaunKohdejoukko(selection.value, selection.selected),
    [APP_EVENT_HAUN_HAKUTAPA_SELECTION_CLEAR]: () => clearHaunHakutapaSelections()
  });
  initStates({
    [APP_STATE_HAUN_HAKUTAPA_SELECTIONS]: {},
    [APP_STATE_HAUN_HAKUTAPA_OPTIONS]: [
      {
        key: 'jatkuva-haku',
        label: 'Jatkuva haku'
      },
      {
        key: 'yhteishaku',
        label: 'Yhteishaku (näkyy vain rekisterin pitäjälle)'
      },
      {
        key: 'erillishaku',
        label: 'Erillishaku'
      }
    ]
  });
};

const clearHaunHakutapaSelections = () => clearState(APP_STATE_HAUN_HAKUTAPA_SELECTIONS);

export const selectHaunKohdejoukko = (haunKohdejoukkoId, selected) => setState(APP_STATE_HAUN_HAKUTAPA_SELECTIONS, {
  [haunKohdejoukkoId]: selected
});
