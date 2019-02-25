import { getFormValues, getFormInitialValues } from 'redux-form';
import get from 'lodash/get';

import { getKoulutusByValues } from '../createKoulutusForm';
import { getKoulutusByKoodi, updateKoutaKoulutus } from '../../apiUtils';
import { createTemporaryToast } from '../toaster';
import { arrayDiff } from '../../utils';

const getKoulutusFormValues = getFormValues('editKoulutusForm');
const getKoulutusFormInitialValues = getFormInitialValues('editKoulutusForm');

const updateKoulutus = ({
  tila,
  lastModified,
  organisaatioOid,
  koulutusOid,
}) => async (dispatch, getState, { history, httpClient, apiUrls }) => {
  const state = getState();
  const values = getKoulutusFormValues(state);

  const {
    me: { kayttajaOid },
  } = state;

  const koulutusFormData = getKoulutusByValues(values);

  const { nimi = null } = await getKoulutusByKoodi({
    koodiUri: koulutusFormData.koulutusKoodiUri,
    httpClient,
    apiUrls,
  });

  const koulutus = {
    lastModified,
    oid: koulutusOid,
    muokkaaja: kayttajaOid,
    nimi,
    johtaaTutkintoon: true,
    ...(tila && { tila }),
    ...(organisaatioOid && { organisaatioOid }),
    ...koulutusFormData,
  };

  const { data } = await updateKoutaKoulutus({ httpClient, apiUrls, koulutus });

  return data;
};

const updateJarjestajat = ({ koulutusOid }) => async (
  dispatch,
  getState,
  { history },
) => {
  const state = getState();
  const koulutus = getKoulutusByValues(getKoulutusFormValues(state));
  const initialKoulutus = getKoulutusByValues(
    getKoulutusFormInitialValues(state),
  );

  const { tarjoajat = [] } = koulutus;
  const { tarjoajat: initialTarjoajat = [] } = initialKoulutus;
  const { removed, added } = arrayDiff(initialTarjoajat, tarjoajat);

  console.log({ lisatyt: added, poistetut: removed });
};

export const submit = ({
  koulutusOid,
  organisaatioOid,
  tila,
  lastModified,
  liitos = false,
}) => async (dispatch, getState, { history, apiUrls, httpClient }) => {
  try {
    if (liitos) {
      await dispatch(updateJarjestajat({ koulutusOid }));

      history.push(
        `/koulutus/${koulutusOid}/muokkaus?organisaatioOid=${organisaatioOid}&liitos=true`,
        {
          koulutusUpdatedAt: Date.now(),
        },
      );
    } else {
      await dispatch(
        updateKoulutus({ koulutusOid, organisaatioOid, tila, lastModified }),
      );

      history.push(`/koulutus/${koulutusOid}/muokkaus`, {
        koulutusUpdatedAt: Date.now(),
      });
    }

    dispatch(
      createTemporaryToast({
        status: 'success',
        title: 'Koulutus on tallennettu onnistuneesti',
      }),
    );
  } catch (e) {
    return dispatch(
      createTemporaryToast({
        status: 'danger',
        title: 'Koulutuksen tallennus epäonnistui',
      }),
    );
  }
};

export const attachToteutus = ({ organisaatioOid, koulutusOid }) => async (
  dispatch,
  getState,
  { history },
) => {
  const values = getKoulutusFormValues(getState());

  const kopioToteutusOid =
    get(values, 'toteutukset.pohja') === 'copy_toteutus'
      ? get(values, 'toteutukset.toteutus.value')
      : null;

  if (kopioToteutusOid) {
    history.push(
      `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/toteutus?kopioToteutusOid=${kopioToteutusOid}`,
    );
  } else {
    history.push(
      `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/toteutus`,
    );
  }
};
