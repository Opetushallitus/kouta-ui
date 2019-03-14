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
          lisatieto: pick(kuvaus, kielivalinta),
        })),
      ],
    };
  });

  const kuvaus = pick(
    mapValues(get(values, 'loppukuvaus.kuvaus') || {}, serializeEditor),
    kielivalinta,
  );

  return {
    kielivalinta,
    hakutapaKoodiUri,
    kohdejoukkoKoodiUri,
    nimi,
    kuvaus,
    metadata: {
      valintavat,
      kielitaitovaatimukset,
    },
  };
};

export const getValuesByValintaperusteet = valintaperusteet => {
  return {};
};
