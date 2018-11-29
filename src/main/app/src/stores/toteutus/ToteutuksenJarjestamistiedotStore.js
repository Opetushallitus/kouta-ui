import {getState, initState, updateState} from '../../utils/stateUtils';
import {
  getBooleanOptions,
  getLisattavaOsioOptions, /*getLukukausiOptions,
  getLukuvuosiOptions,*/ getOpetusaikaOptions, getOpetuskieliOptions, getOpetustapaOptions
} from '../../model/ToteutuksenJarjestamistiedot';
import {
  updateMultiSelectionOptionActivation, updateOptionValue,
  updateSingleSelectionOptionActivation
} from '../../utils/optionListUtils';

export const APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS = 'APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS';

export const ToteutuksenJarjestamistiedotStore = () => initState(APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS, {
    lisattavaOsioOptions: getLisattavaOsioOptions(),
    opetuskieliOptions: getOpetuskieliOptions(),
    opetusaikaOptions: getOpetusaikaOptions(),
    opetustapaOptions: getOpetustapaOptions(),
    maksullisuusOptions: getBooleanOptions(),
    kuvaus: {},
    maksunMaara: {}
    //lukuvuosimaksuOptions: getBooleanOptions(),
    //stipendiOptions: getBooleanOptions(),
    //lukukausiOptions: getLukukausiOptions(),
    //lukuvuosiOptions: getLukuvuosiOptions()
  }
);

export const changeCheckboxSelection = (targetOptions, change) => updateState(APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS, {
  [targetOptions]: updateMultiSelectionOptionActivation(getOptionsByName(targetOptions), change)
});

export const changeRadioSelection = (targetOptions, change) =>  updateState(APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS, {
  [targetOptions]: updateSingleSelectionOptionActivation(getOptionsByName(targetOptions), change)
});

export const  changeSelectionValue = (targetOptions, change) => updateState(APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS, {
  [targetOptions]: updateOptionValue(getOptionsByName(targetOptions), change)
});

export const addKieliValue = (target, language, change) => {
    updateState(APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS, { [target]: {
        ...getOptionsByName(target),
        [language]: change
    }});
};

export const getKieliValue = (target, language) => {
  const value = getOptionsByName(target);
  return value && value[language];
};

const getOptionsByName = (optionsName) => getState(APP_STATE_TOTEUTUKSEN_JARJESTAMISTIEDOT_OPTIONS, optionsName);

