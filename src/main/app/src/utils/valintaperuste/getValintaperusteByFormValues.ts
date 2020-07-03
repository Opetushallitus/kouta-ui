import _ from 'lodash';
import produce from 'immer';
import { isNumeric, isDeepEmptyFormValues } from '#/src/utils';
import { serializeEditorState } from '#/src/components/Editor/utils';
import getKokeetTaiLisanaytotData from '#/src/utils/form/getKokeetTaiLisanaytotData';

const getArrayValue = (values, key) => {
  const valueCandidate = _.get(values, key);
  return isDeepEmptyFormValues(valueCandidate) ? [] : valueCandidate;
};

const serializeTable = ({ table, kielivalinta }) => {
  if (!_.get(table, 'rows')) {
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

const serializeSisalto = ({ sisalto, kielivalinta = [] }) => {
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

const getValintaperusteByFormValues = values => {
  const { tila, muokkaaja, perustiedot } = values;

  const hakutapaKoodiUri = _.get(perustiedot, 'hakutapa');

  const kielivalinta = _.get(perustiedot, 'kieliversiot') || [];

  const kohdejoukkoKoodiUri = _.get(perustiedot, 'kohdejoukko.value') || null;

  const nimi = _.pick(_.get(values, 'kuvaus.nimi'), kielivalinta);

  const kuvaus = _.pick(
    _.mapValues(_.get(values, 'kuvaus.kuvaus') || {}, serializeEditorState),
    kielivalinta
  );

  const valintatavat = getArrayValue(values, 'valintatavat').map(
    ({
      tapa,
      kuvaus,
      nimi,
      kynnysehto,
      enimmaispistemaara,
      vahimmaispistemaara,
      sisalto,
    }) => ({
      kuvaus: _.pick(kuvaus || {}, kielivalinta),
      nimi: _.pick(nimi || {}, kielivalinta),
      valintatapaKoodiUri: _.get(tapa, 'value'),
      sisalto: serializeSisalto({ sisalto, kielivalinta }),
      kaytaMuuntotaulukkoa: false,
      kynnysehto: _.pick(kynnysehto || {}, kielivalinta),
      enimmaispisteet: isNumeric(enimmaispistemaara)
        ? parseFloat(enimmaispistemaara)
        : null,
      vahimmaispisteet: isNumeric(vahimmaispistemaara)
        ? parseFloat(vahimmaispistemaara)
        : null,
    })
  );

  const valintakokeidenYleiskuvaus = _.mapValues(
    _.get(values, 'valintakokeet.yleisKuvaus'),
    kuvaus => serializeEditorState(kuvaus)
  );

  const valintakokeet = getKokeetTaiLisanaytotData({
    valintakoeValues: _.get(values, 'valintakokeet'),
    kielivalinta,
  });

  const koulutustyyppi = _.get(perustiedot, 'tyyppi') || null;
  const sorakuvausId = _.get(values, 'soraKuvaus.value') || null;
  const onkoJulkinen = Boolean(_.get(values, 'julkinen'));

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
      valintakokeidenYleiskuvaus,
    },
  };
};

export default getValintaperusteByFormValues;
