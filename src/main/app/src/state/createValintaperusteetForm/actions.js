import { getFormValues } from 'redux-form';
import get from 'lodash/get';
import toPairs from 'lodash/toPairs';

import {
  JULKAISUTILA,
  VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI,
} from '../../constants';
import { createTemporaryToast } from '../toaster';

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

export const submit = ({ tila = JULKAISUTILA.TALLENNETTU } = {}) => async (
  dispatch,
  getState,
  { history },
) => {
  const state = getState();
  const values = getValintaperusteetFormValues(state);

  const {
    me: { kayttajaOid: muokkaaja },
  } = state;

  const { organisaatioOid } = getOidsFromPathname(history.location.pathname);

  const hakutapaKoodiUri = get(values, 'hakutavanRajaus.hakutapa');

  const kielivalinta = get(values, 'kieliversiot.languages') || [];

  const kohdejoukkoKoodiUri = get(
    values,
    'kohdejoukonRajaus.kohdejoukko.value',
  );

  const nimi = get(values, 'nimi.nimi');

  const valintavat = (get(values, 'valintatapa.valintatavat') || []).map(
    ({
      tapa,
      kuvaus,
      taulukot,
      kynnysehto,
      enimmaispistemaara,
      vahimmaispistemaara,
    }) => ({
      kuvaus,
      valintapaKoodiUri: get(tapa, 'value'),
      taulukot: taulukot || [],
      kaytaMuuntotaulukkoa: false,
      kynnysehto,
      enimmaispisteet: enimmaispistemaara,
      vahimmaispiteet: vahimmaispistemaara,
    }),
  );

  const kielitaitovaatimukset = (
    get(values, 'kielitaitovaatimukset.kielet') || []
  ).map(({ kieli, tyyppi, kuvaukset, osoitustavat, muutOsoitustavat }) => {
    const activeTyypit = toPairs(tyyppi || {})
      .filter(([uri, value]) => !!value)
      .map(([uri]) => uri);

    const vaatimukset = activeTyypit.map(kielitaitovaatimusKoodiUri => ({
      kielitaitovaatimusKoodiUri,
      kielitaitovaatimusKuvaukset: (
        get(kuvaukset, kielitaitovaatimusKoodiUri) || []
      ).map(({ kuvaus, taso }) => ({
        kielitaitovaatimusTaso: taso,
        kielitaitovaatimusKuvausKoodiUri: get(kuvaus, 'value'),
      })),
    }));

    return {
      kielivalinta,
      kieliKoodiUri: get(kieli, 'value'),
      vaatimukset,
      kielitaidonVoiOsoittaa: [
        ...(osoitustavat || []).map(kielitaitoKoodiUri => ({
          kielitaitoKoodiUri,
          lisatieto: {},
        })),
        ...(muutOsoitustavat || []).map(({ kuvaus }) => ({
          kielitaitoKoodiUri: `${VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI}#1`,
          lisatieto: kuvaus,
        })),
      ],
    };
  });

  const valintaperusteet = {
    tila,
    muokkaaja,
    organisaatioOid,
    hakutapaKoodiUri,
    kohdejoukkoKoodiUri,
    nimi,
    metadata: {
      valintavat,
      kielitaitovaatimukset,
    },
  };

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
