import mapValues from 'lodash/mapValues';

import { isObject, isArray } from './index';
import { VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI } from '../constants';
import parseEditorState from './draft/parseEditorState';

const kielitaitoMuuOsoitusKoodiUriRegExp = new RegExp(
  `^${VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI}`,
);

const parseSisalto = ({ sisalto }) => {
  if (!isArray(sisalto)) {
    return [];
  }

  return sisalto.map(({ tyyppi, data }) => {
    if (tyyppi === 'teksti') {
      return {
        tyyppi,
        data: isObject(data) ? mapValues(data, parseEditorState) : {},
      };
    }

    return { tyyppi, data };
  });
};

const getFormValuesByValintaperuste = valintaperuste => {
  const {
    hakutapaKoodiUri = null,
    kielivalinta = [],
    kohdejoukkoKoodiUri = null,
    nimi = {},
    metadata = {},
    koulutustyyppi = null,
  } = valintaperuste;

  const {
    osaamistaustaKoodiUrit = [],
    kielitaitovaatimukset: kielitaitovaatimuksetArg = [],
    valintatavat = [],
    kuvaus = {},
    soraKuvausId,
  } = metadata;

  const kielitaitovaatimukset = (kielitaitovaatimuksetArg || []).map(
    ({
      kieliKoodiUri = null,
      vaatimukset = [],
      kielitaidonVoiOsoittaa = [],
    }) => {
      return {
        kieli: kieliKoodiUri ? { value: kieliKoodiUri } : null,
        ...(vaatimukset || []).reduce(
          (
            acc,
            { kielitaitovaatimusKoodiUri, kielitaitovaatimusKuvaukset },
          ) => {
            if (kielitaitovaatimusKoodiUri) {
              acc.tyyppi[kielitaitovaatimusKoodiUri] = true;
              acc.kuvaukset[kielitaitovaatimusKoodiUri] = (
                kielitaitovaatimusKuvaukset || []
              ).map(
                ({
                  kielitaitovaatimusTaso,
                  kielitaitovaatimusKuvausKoodiUri,
                }) => ({
                  taso: kielitaitovaatimusTaso || '',
                  kuvaus: kielitaitovaatimusKuvausKoodiUri
                    ? { value: kielitaitovaatimusKuvausKoodiUri }
                    : null,
                }),
              );
            }

            return acc;
          },
          { kuvaukset: {}, tyyppi: {} },
        ),
        osoitustavat: kielitaidonVoiOsoittaa
          .filter(
            ({ kielitaitoKoodiUri }) =>
              !kielitaitoMuuOsoitusKoodiUriRegExp.test(kielitaitoKoodiUri),
          )
          .map(({ kielitaitoKoodiUri }) => kielitaitoKoodiUri),
        muutOsoitustavat: kielitaidonVoiOsoittaa
          .filter(({ kielitaitoKoodiUri }) =>
            kielitaitoMuuOsoitusKoodiUriRegExp.test(kielitaitoKoodiUri),
          )
          .map(({ lisatieto = {} }) => ({ kuvaus: lisatieto })),
      };
    },
  );

  return {
    kieliversiot: kielivalinta,
    hakutapa: hakutapaKoodiUri,
    kohdejoukko: kohdejoukkoKoodiUri ? { value: kohdejoukkoKoodiUri } : null,
    kuvaus: {
      nimi,
      kuvaus: mapValues(kuvaus || {}, parseEditorState),
    },
    osaamistausta: (osaamistaustaKoodiUrit || []).map(value => ({ value })),
    kielitaitovaatimukset: kielitaitovaatimukset,
    valintatavat: (valintatavat || []).map(
      ({
        kuvaus,
        nimi,
        valintatapaKoodiUri,
        sisalto,
        kynnysehto,
        enimmaispisteet,
        vahimmaispisteet,
      }) => ({
        kuvaus: kuvaus || {},
        nimi: nimi || {},
        kynnysehto: kynnysehto || {},
        tapa: valintatapaKoodiUri ? { value: valintatapaKoodiUri } : null,
        enimmaispistemaara: enimmaispisteet || '',
        vahimmaispistemaara: vahimmaispisteet || '',
        sisalto: parseSisalto({ sisalto }),
      }),
    ),
    tyyppi: koulutustyyppi,
    soraKuvaus: {
      value: soraKuvausId,
    },
  };
};

export default getFormValuesByValintaperuste;
