import get from 'lodash/get';
import produce from 'immer';
import toPairs from 'lodash/toPairs';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';

import { isObject, isArray } from '../../utils';
import { VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI } from '../../constants';

import {
  serialize as serializeEditor,
  parse as parseEditor,
} from '../../components/Editor';

const kielitaitoMuuOsoitusKoodiUriRegExp = new RegExp(
  `^${VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI}`,
);

const serializeTable = ({ table, kielivalinta }) => {
  if (!get(table, 'rows')) {
    return { rows: [] };
  }

  return produce(table, draft => {
    (draft.rows || []).forEach((row, rowIndex) => {
      if (isObject(row)) {
        row.index = rowIndex;

        (row.columns || []).forEach((column, columnIndex) => {
          if (isObject(column)) {
            column.index = columnIndex;

            if (isObject(column.text)) {
              column.text = pick(column.text, kielivalinta);
            }
          }
        });
      }
    });
  });
};

const serializeSisalto = ({ sisalto, kielivalinta = [] }) => {
  if (!isArray(sisalto)) {
    return [];
  }

  return sisalto.map(({ type, data }) => {
    let serializedData = {};

    if (type === 'text') {
      serializedData = pick(
        isObject(data) ? mapValues(data, serializeEditor) : {},
        kielivalinta,
      );
    }

    if (type === 'table') {
      serializedData = serializeTable({ table: data, kielivalinta });
    }

    return {
      type,
      data: serializedData,
    };
  });
};

export const getValintaperusteetByValues = values => {
  const hakutapaKoodiUri = get(values, 'hakutavanRajaus.hakutapa');

  const kielivalinta = get(values, 'kieliversiot.languages') || [];

  const kohdejoukkoKoodiUri = get(
    values,
    'kohdejoukonRajaus.kohdejoukko.value',
  );

  const nimi = pick(get(values, 'nimi.nimi'), kielivalinta);

  const valintavat = (get(values, 'valintatapa.valintatavat') || []).map(
    ({
      tapa,
      kuvaus,
      nimi,
      kynnysehto,
      enimmaispistemaara,
      vahimmaispistemaara,
      sisalto,
    }) => ({
      kuvaus: pick(kuvaus || {}, kielivalinta),
      nimi: pick(nimi || {}, kielivalinta),
      valintapaKoodiUri: get(tapa, 'value'),
      sisalto: serializeSisalto({ sisalto, kielivalinta }),
      kaytaMuuntotaulukkoa: false,
      kynnysehto: pick(kynnysehto || {}, kielivalinta),
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
      kieliKoodiUri: get(kieli, 'value'),
      vaatimukset,
      kielitaidonVoiOsoittaa: [
        ...(osoitustavat || []).map(kielitaitoKoodiUri => ({
          kielitaitoKoodiUri,
          lisatieto: {},
        })),
        ...(muutOsoitustavat || []).map(({ kuvaus }) => ({
          kielitaitoKoodiUri: `${VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI}#1`,
          lisatieto: pick(kuvaus, kielivalinta),
        })),
      ],
    };
  });

  const kuvaus = pick(
    mapValues(get(values, 'loppukuvaus.kuvaus') || {}, serializeEditor),
    kielivalinta,
  );

  const osaamistaustaKoodiUrit = (
    get(values, 'osaamistausta.osaamistausta') || []
  ).map(({ value }) => value);

  return {
    kielivalinta,
    hakutapaKoodiUri,
    kohdejoukkoKoodiUri,
    nimi,
    kuvaus,
    metadata: {
      valintavat,
      kielitaitovaatimukset,
      osaamistaustaKoodiUrit,
    },
  };
};

export const getValuesByValintaperusteet = valintaperusteet => {
  const {
    hakutapaKoodiUri = null,
    kielivalinta = [],
    kohdejoukkoKoodiUri = null,
    nimi = {},
    kuvaus = {},
    metadata = {},
  } = valintaperusteet;

  const {
    osaamistaustaKoodiUrit = [],
    kielitaitovaatimukset: kielitaitovaatimuksetArg = [],
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
    kieliversiot: {
      languages: kielivalinta,
    },
    hakutavanRajaus: {
      hakutapa: hakutapaKoodiUri,
    },
    kohdejoukonRajaus: {
      kohdejoukko: kohdejoukkoKoodiUri ? { value: kohdejoukkoKoodiUri } : null,
    },
    nimi: {
      nimi,
    },
    loppukuvaus: {
      kuvaus: mapValues(kuvaus || {}, parseEditor),
    },
    osaamistausta: {
      osaamistausta: (osaamistaustaKoodiUrit || []).map(value => ({ value })),
    },
    kielitaitovaatimukset: {
      kielet: kielitaitovaatimukset,
    },
  };
};
