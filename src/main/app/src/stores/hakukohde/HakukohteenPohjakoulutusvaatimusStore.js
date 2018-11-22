import {getState, initState, setState, updateState} from '../../utils/stateUtils';
import {updateOptionValue, updateSingleSelectionOptionActivation} from '../../utils/optionListUtils';

export const APP_STATE_HAKUKUOHTEEN_POHJAKOULUTUSVAATIMUS = 'APP_STATE_HAKUKUOHTEEN_POHJAKOULUTUSVAATIMUS';

export const HakukohteenPohjakoulutusvaatimusStore = () => initState(APP_STATE_HAKUKUOHTEEN_POHJAKOULUTUSVAATIMUS, {
  options: getHakukohteenPohjakoulutusvaatimusInitialOptions()
});

export const selectPohjakoulutusvaatimus = (change) => updateState(APP_STATE_HAKUKUOHTEEN_POHJAKOULUTUSVAATIMUS, {
  options: updateSingleSelectionOptionActivation(getHakukohteenPohjakoulutusvaatimusOptions(), change)
});

export const updateMuuValinta = (change) => updateState(APP_STATE_HAKUKUOHTEEN_POHJAKOULUTUSVAATIMUS, {
  muuValinta: updateOptionValue(getHakukohteenPohjakoulutusvaatimusOptions(), change)
});

export const clearSelections = () => setState(APP_STATE_HAKUKUOHTEEN_POHJAKOULUTUSVAATIMUS, {
  options: getHakukohteenPohjakoulutusvaatimusInitialOptions()
})

const getHakukohteenPohjakoulutusvaatimusInitialOptions = () => [
  {
    key: 'eruskoulu-pk',
    label: 'Peruskoulu PK'
  },
  {
    key: 'lukion-oppimaara-yo',
    label: 'Lukion oppimäärä YO'
  },
  {
    key: 'erityisopetus-amm',
    label: 'Erityisopetuksena järjestettävä ammatillinen perustutkinto'
  },
  {
    key: 'ei-pohjakouluvaatimusta',
    label: 'Ei pohjakouluvaatimusta'
  },
  {
    key: 'muu-valinta',
    label: 'Muu, mikä',
    input: true
  }
];

const getHakukohteenPohjakoulutusvaatimusOptions = () => getState(APP_STATE_HAKUKUOHTEEN_POHJAKOULUTUSVAATIMUS, 'options');
