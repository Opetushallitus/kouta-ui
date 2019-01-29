import { getFormValues } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA } from '../../constants';
import { getKoulutusByKoodi } from '../../apiUtils';
import { createTemporaryToast } from '../toaster';

const getKoulutusFormValues = getFormValues('createKoulutusForm');

const getOrganisaatioOidFromPathname = pathname => {
  const split = pathname.split('/').filter(p => !!p);

  return split[1];
};

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

  const organisaatioOid = getOrganisaatioOidFromPathname(
    history.location.pathname,
  );

  const {
    me: { kayttajaOid },
  } = state;

  const kielivalinta = Object.keys(values.language).filter(
    key => !!values.language[key],
  );

  const tarjoajat = get(values, 'organization.organizations') || null;
  const koulutusKoodiUri = get(values, 'information.koulutus.value') || null;
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

  dispatch(
    createTemporaryToast({
      status: 'success',
      title: 'Koulutus on tallennettu onnistuneesti',
    }),
  );

  if (get(koulutusData, 'oid') && JULKAISUTILA.TALLENNETTU) {
    const { oid: koulutusOid } = koulutusData;

    history.push(
      `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/toteutus`,
    );
  } else {
    history.push('/');
  }
};
