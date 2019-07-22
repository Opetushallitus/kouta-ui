import get from 'lodash/get';
import produce from 'immer';
import toPairs from 'lodash/toPairs';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';

import { isObject, isArray, isNumeric } from './index';
import { VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI } from '../constants';
import serializeEditorState from './draft/serializeEditorState';

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

  return sisalto.map(({ tyyppi, data }) => {
    let serializedData = {};

    if (tyyppi === 'teksti') {
      serializedData = pick(
        isObject(data) ? mapValues(data, serializeEditorState) : {},
        kielivalinta,
      );
    }

    if (tyyppi === 'taulukko') {
      serializedData = serializeTable({ table: data, kielivalinta });
    }

    return {
      tyyppi,
      data: serializedData,
    };
  });
};

const getValintaperusteByFormValues = values => {
  const { tila, muokkaaja } = values;

  const hakutapaKoodiUri = get(values, 'hakutapa');

  const kielivalinta = get(values, 'kieliversiot') || [];

  const kohdejoukkoKoodiUri = get(values, 'kohdejoukko.value') || null;

  const nimi = pick(get(values, 'kuvaus.nimi'), kielivalinta);

  const kuvaus = pick(
    mapValues(get(values, 'kuvaus.kuvaus') || {}, serializeEditorState),
    kielivalinta,
  );

  const valintatavat = (get(values, 'valintatavat') || []).map(
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
      valintatapaKoodiUri: get(tapa, 'value') || null,
      sisalto: serializeSisalto({ sisalto, kielivalinta }),
      kaytaMuuntotaulukkoa: false,
      kynnysehto: pick(kynnysehto || {}, kielivalinta),
      enimmaispisteet: isNumeric(enimmaispistemaara)
        ? parseFloat(enimmaispistemaara)
        : null,
      vahimmaispisteet: isNumeric(vahimmaispistemaara)
        ? parseFloat(vahimmaispistemaara)
        : null,
    }),
  );

  const kielitaitovaatimukset = (
    get(values, 'kielitaitovaatimukset') || []
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
        kielitaitovaatimusKuvausKoodiUri: get(kuvaus, 'value') || null,
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

  const osaamistaustaKoodiUrit = (get(values, 'osaamistausta') || []).map(
    ({ value }) => value,
  );

  const koulutustyyppi = get(values, 'tyyppi') || null;
  const soraKuvausId = get(values, 'soraKuvaus.value') || null;

  return {
    tila,
    muokkaaja,
    kielivalinta,
    hakutapaKoodiUri,
    kohdejoukkoKoodiUri,
    nimi,
    koulutustyyppi,
    metadata: {
      koulutustyyppi,
      valintatavat,
      kielitaitovaatimukset,
      osaamistaustaKoodiUrit,
      kuvaus,
      soraKuvausId,
    },
  };
};

export default getValintaperusteByFormValues;
