import { getFormValues } from 'redux-form';
import produce from 'immer';

import { JULKAISUTILA } from '../../constants';
import { createTemporaryToast } from '../toaster';
import { getValintaperusteetByValues } from './utils';
import { KOULUTUSTYYPPI_CATEGORY } from '../../constants';

const getValintaperusteetFormValues = getFormValues(
  'createValintaperusteetForm',
);

const getOidsFromPathname = pathname => {
  const split = pathname.split('/').filter(p => !!p);

  return {
    organisaatioOid: split[1],
  };
};

export const saveValintaperusteet = valintaperusteet => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return httpClient.put(
    apiUrls.url('kouta-backend.valintaperuste'),
    valintaperusteet,
  );
};

export const submit = ({
  tila = JULKAISUTILA.TALLENNETTU,
  koulutustyyppi = KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS,
} = {}) => async (dispatch, getState, { history }) => {
  const state = getState();
  const values = getValintaperusteetFormValues(state);

  const valintaperusteetFormData = getValintaperusteetByValues(values);

  const {
    me: { kayttajaOid: muokkaaja },
  } = state;

  const { organisaatioOid } = getOidsFromPathname(history.location.pathname);

  const valintaperusteet = produce(
    {
      tila,
      muokkaaja,
      organisaatioOid,
      ...valintaperusteetFormData,
    },
    draft => {
      draft.metadata.tyyppi = koulutustyyppi;
    },
  );

  try {
    await dispatch(saveValintaperusteet(valintaperusteet));
  } catch (e) {
    return dispatch(
      createTemporaryToast({
        status: 'danger',
        title: 'Valintaperusteiden tallennus epäonnistui',
      }),
    );
  }

  dispatch(
    createTemporaryToast({
      status: 'success',
      title: 'Valintaperusteet on tallennettu onnistuneesti',
    }),
  );

  history.push('/');
};
