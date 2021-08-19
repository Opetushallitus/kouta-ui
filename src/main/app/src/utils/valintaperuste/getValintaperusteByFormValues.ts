import produce from 'immer';
import _ from 'lodash';

import { serializeEditorState } from '#/src/components/Editor/utils';
import { isNumeric, isDeepEmptyFormValues, parseFloatComma } from '#/src/utils';
import { getKokeetTaiLisanaytotData } from '#/src/utils/form/getKokeetTaiLisanaytotData';

import { KOULUTUSTYYPIT_WITH_VALINTATAPA } from './constants';

const getArrayValue = (values, key) => {
  const valueCandidate = _.get(values, key);
  return isDeepEmptyFormValues(valueCandidate) ? [] : valueCandidate;
};

const serializeTable = ({ table, kielivalinta }) => {
  if (!table?.rows) {
    return { rows: [] };
  }

  return produce(table, draft => {
    (draft.rows || []).forEach((row, rowIndex) => {
      if (_.isObject(row)) {
        row.index = rowIndex;

        (row.columns || []).forEach((column, columnIndex) => {
          if (_.isObject(column)) {
            column.index = columnIndex;

            if (_.isObject(column.text)) {
              column.text = _.pick(column.text, kielivalinta);
            }
          }
        });
      }
    });
  });
};

const serializeSisalto = (sisalto, kielivalinta = []) => {
  if (!_.isArray(sisalto)) {
    return [];
  }

  return sisalto.map(({ tyyppi, data }) => {
    let serializedData = {};

    if (tyyppi === 'teksti') {
      serializedData = _.pick(
        _.isObject(data) ? _.mapValues(data, serializeEditorState) : {},
        kielivalinta
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

export const getValintaperusteByFormValues = values => {
  const { tila, muokkaaja, perustiedot, esikatselu = false } = values;

  const koulutustyyppi = perustiedot?.tyyppi ?? null;
  const julkinen = Boolean(values?.julkinen);

  const hakutapaKoodiUri = perustiedot?.hakutapa;
  const kielivalinta = perustiedot?.kieliversiot ?? [];
  const kohdejoukkoKoodiUri = perustiedot?.kohdejoukko?.value ?? null;
  const nimi = _.pick(values?.kuvaus?.nimi, kielivalinta);

  const kuvaus = _.pick(
    _.mapValues(values?.kuvaus?.kuvaus ?? {}, serializeEditorState),
    kielivalinta
  );
  const hakukelpoisuus = _.mapValues(
    _.pick(values?.hakukelpoisuus || {}, kielivalinta),
    serializeEditorState
  );
  const lisatiedot = _.mapValues(
    _.pick(values?.lisatiedot || {}, kielivalinta),
    serializeEditorState
  );
  const sisalto = serializeSisalto(values?.kuvaus?.sisalto, kielivalinta);

  const valintatavat = KOULUTUSTYYPIT_WITH_VALINTATAPA.includes(koulutustyyppi)
    ? getArrayValue(values, 'valintatavat').map(
        ({
          nimi: valintatapaNimi,
          kuvaus: valintatapaKuvaus,
          sisalto: valintatapaSisalto,
          tapa,
          kynnysehto,
          enimmaispistemaara,
          vahimmaispistemaara,
        }) => ({
          nimi: _.pick(valintatapaNimi || {}, kielivalinta),
          kuvaus: _.pick(valintatapaKuvaus || {}, kielivalinta),
          sisalto: serializeSisalto(valintatapaSisalto, kielivalinta),
          valintatapaKoodiUri: tapa?.value,
          kaytaMuuntotaulukkoa: false,
          kynnysehto: _.mapValues(
            _.pick(kynnysehto || {}, kielivalinta),
            serializeEditorState
          ),
          enimmaispisteet: isNumeric(enimmaispistemaara)
            ? parseFloatComma(enimmaispistemaara)
            : null,
          vahimmaispisteet: isNumeric(vahimmaispistemaara)
            ? parseFloatComma(vahimmaispistemaara)
            : null,
        })
      )
    : [];

  const valintakokeidenYleiskuvaus = _.mapValues(
    values?.valintakokeet?.yleisKuvaus,
    serializeEditorState
  );

  const valintakokeet = getKokeetTaiLisanaytotData({
    valintakoeValues: values?.valintakokeet,
    kielivalinta,
  });

  return {
    organisaatioOid: values?.organisaatioOid?.value,
    externalId: _.isEmpty(values?.externalId) ? null : values?.externalId,
    tila,
    muokkaaja,
    kielivalinta,
    hakutapaKoodiUri,
    kohdejoukkoKoodiUri,
    nimi,
    koulutustyyppi,
    julkinen,
    valintakokeet,
    metadata: {
      tyyppi: koulutustyyppi,
      valintatavat,
      kuvaus,
      sisalto,
      valintakokeidenYleiskuvaus,
      hakukelpoisuus,
      lisatiedot,
    },
    esikatselu,
  };
};
