import { getFormValues } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA } from '../../constants';
import { getKoulutusByKoodi } from '../../apiUtils';

const getKoulutusFormValues = getFormValues('createKoulutusForm');

export const saveKoulutus = koulutus => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return httpClient.put(apiUrls.url('kouta-backend.koulutus'), koulutus);
};

export const submit = ({ tila = JULKAISUTILA.TALLENNETTU } = {}) => async (
  dispatch,
  getState,
  { httpClient, apiUrls, history },
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
  const koulutusKoodiUri = get(values, 'information.koulutus') || null;
  const koulutustyyppi = get(values, 'type.type') || null;

  const { nimi = null } = await getKoulutusByKoodi({
    koodiUri: koulutusKoodiUri,
    httpClient,
    apiUrls,
  });

  const koulutus = {
    organisaatioOid,
    muokkaaja: kayttajaOid,
    kielivalinta,
    tila,
    tarjoajat,
    koulutusKoodiUri,
    nimi,
    johtaaTutkintoon: true,
    koulutustyyppi,
  };

  const { data: koulutusData } = await dispatch(saveKoulutus(koulutus));

  if (get(koulutusData, 'oid') && JULKAISUTILA.JULKAISTU) {
    const { oid: koulutusOid } = koulutusData;

    history.push(`/koulutus/${koulutusOid}/toteutus`);
  } else {
    history.push('/');
  }
};
