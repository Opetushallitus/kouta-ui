import get from 'lodash/get';
import produce from 'immer';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';

import { isObject, isArray, isNumeric } from './index';
import serializeEditorState from './draft/serializeEditorState';
import getValintakoeFieldsData from './getValintakoeFieldsData';

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

  const valintakokeet = getValintakoeFieldsData({
    valintakoeValues: get(values, 'valintakoe'),
    kielivalinta,
  });

  const koulutustyyppi = get(values, 'tyyppi') || null;
  const sorakuvausId = get(values, 'soraKuvaus.value') || null;
  const onkoJulkinen = Boolean(get(values, 'julkinen'));

  return {
    tila,
    muokkaaja,
    kielivalinta,
    hakutapaKoodiUri,
    kohdejoukkoKoodiUri,
    nimi,
    koulutustyyppi,
    onkoJulkinen,
    valintakokeet,
    sorakuvausId,
    metadata: {
      tyyppi: koulutustyyppi,
      valintatavat,
      kielitaitovaatimukset: [],
      osaamistaustaKoodiUrit: [],
      kuvaus,
    },
  };
};

export default getValintaperusteByFormValues;
