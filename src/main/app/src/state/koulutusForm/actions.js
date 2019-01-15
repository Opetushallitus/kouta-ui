import { getFormValues } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA } from '../../constants';

const getKoulutusFormValues = getFormValues('koulutusForm');

export const saveKoulutus = koulutus => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return httpClient.put(apiUrls.url('kouta-backend.koulutus'), koulutus);
};

export const submit = ({ tila = JULKAISUTILA.TALLENNETTU } = {}) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const values = getKoulutusFormValues(state);

  const {
    me: { organisaatioOid, kayttajaOid },
  } = state;

  const kielivalinta = Object.keys(values.language).filter(
    key => !!values.language[key],
  );

  const tarjoajat = get(values, 'organization.organizations') || null;
  const koulutsKoodiUri = get(values, 'information.koulutus') || null;

  const koulutus = {
    organisaatioOid,
    muokkaaja: kayttajaOid,
    kielivalinta,
    tila,
    tarjoajat,
    koulutsKoodiUri,
  };

  return dispatch(saveKoulutus(koulutus));
};
