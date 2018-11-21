import {getState, setState, updateState} from '../../utils/stateUtils';
import {getActiveKey, updateSingleSelectionOptionActivation} from '../../utils/optionListUtils';

export const APP_STATE_HAUN_LOMAKKEET = 'APP_STATE_HAUN_LOMAKKEET';

export const HAKULOMAKE_TYPE = {
  HAKEMUSPALVELU: 'hakemuspalvelu',
  JARJESTELMA: 'jarjestelma',
  MUU: 'muu',
  EI_SAHKOINEN: 'ei_sahkoinen'
};

export const HaunLomakkeetStore = () => setState(APP_STATE_HAUN_LOMAKKEET, {
  lomakkeenTyyppiOptions: getHakulomakkeenTyyppiInitialOptions(),
  jarjestelmalomakeOptions: getJarjestelmalomakeInitialOptions(),
  hakemuspalvelunLomakeOptions: getHakemuspalvelunLomakeInitialOptions(),
  form: {
    muuLomake: 'Muu lomake jee je jee'
  }
});

export const changeLomakkeenTyyppiSelection = (change) => {
  const lomakkeenTyyppiOptions = updateSingleSelectionOptionActivation(getHakulomakkeenTyyppiOptions(), change);
  const activeLomakkeenTyyppi = getActiveKey(lomakkeenTyyppiOptions);
  updateState(APP_STATE_HAUN_LOMAKKEET, {
    lomakkeenTyyppiOptions,
    activeLomakkeenTyyppi
  });
};

export const selectHakemuspalvelunLomake = (change) => updateState(APP_STATE_HAUN_LOMAKKEET, {
  hakemuspalvelunLomakeOptions: updateSingleSelectionOptionActivation(getHakemuspalvelunLomakeOptions(), change)
});

export const selectJarjestelmalomake = (change) => updateState(APP_STATE_HAUN_LOMAKKEET, {
  jarjestelmalomakeOptions: updateSingleSelectionOptionActivation(getJarjestelmalomakeOptions(), change)
});

export const updateMuuLomakeValue = (value) => {
  updateState(APP_STATE_HAUN_LOMAKKEET, {
    form: {
      muuLomake: value
    }
  });
};

const getHakulomakkeenTyyppiOptions = () => getState(APP_STATE_HAUN_LOMAKKEET, 'lomakkeenTyyppiOptions');

const getHakulomakkeenTyyppiInitialOptions = () => [
  {
    key: HAKULOMAKE_TYPE.HAKEMUSPALVELU,
    label: 'Käytetään hakemuspalvelun lomaketta'
  },
  {
    key: HAKULOMAKE_TYPE.JARJESTELMA,
    label: 'Käytetään järjestelmän hakulomaketta'
  },
  {
    key: HAKULOMAKE_TYPE.MUU,
    label: 'Käytetään muuta hakulomaketta'
  },
  {
    key: HAKULOMAKE_TYPE.EI_SAHKOINEN,
    label: 'Ei sähköistä hakua'
  }
];

const getHakemuspalvelunLomakeInitialOptions = () => [
  {
    key: 'hakemuspalvelun-lomake-1',
    label: 'Hakemuspalvelun lomake 1'
  },
  {
    key: 'hakemuspalvelun-lomake-2',
    label: 'Hakemuspalvelun lomake 2'
  },
  {
    key: 'hakemuspalvelun-lomake-3',
    label: 'Hakemuspalvelun lomake 3'
  }
];

const getJarjestelmalomakeInitialOptions = () => [
  {
    key: 'jarjestelmalomake-1',
    label: 'Järjestelmälomake 1'
  },
  {
    key: 'jarjestelmalomake-2',
    label: 'Järjestelmälomake 2'
  },
  {
    key: 'jarjestelmalomake-3',
    label: 'Järjestelmälomake 3'
  }
];

const getHakemuspalvelunLomakeOptions = () => getState(APP_STATE_HAUN_LOMAKKEET, 'hakemuspalvelunLomakeOptions');

const getJarjestelmalomakeOptions = () => getState(APP_STATE_HAUN_LOMAKKEET, 'jarjestelmalomakeOptions');
