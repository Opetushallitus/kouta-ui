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
    key: 'pohjakoulutusvaatimustoinenaste_pk#2',
    label: 'Peruskoulu PK'
  },
  {
    key: 'pohjakoulutusvaatimustoinenaste_yo#2',
    label: 'Lukion oppimäärä YO'
  },
  {
    key: 'pohjakoulutusvaatimustoinenaste_amm#2',
    label: 'Erityisopetuksena järjestettävä ammatillinen perustutkinto'
  },
  {
    key: 'pohjakoulutusvaatimustoinenaste_xx#2',
    label: 'Ei pohjakouluvaatimusta'
  },
  {
    key: 'pohjakoulutusvaatimustoinenaste_muu#2',
    label: 'Muu, mikä',
    input: true
  }
];

const getHakukohteenPohjakoulutusvaatimusOptions = () => getState(APP_STATE_HAKUKUOHTEEN_POHJAKOULUTUSVAATIMUS, 'options');
