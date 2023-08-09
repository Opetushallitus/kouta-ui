import { produce } from 'immer';
import _ from 'lodash';
import { match, P } from 'ts-pattern';

import { serializeEditorState } from '#/src/components/LexicalEditorUI/utils';
import { TableInputValue } from '#/src/components/TableInput/utils';
import { KieliversiotValues, SisaltoValues } from '#/src/types/formTypes';
import { ValintaperusteValues } from '#/src/types/valintaperusteTypes';
import { isNumeric, isDeepEmptyFormValues, parseFloatComma } from '#/src/utils';
import { getKokeetTaiLisanaytotData } from '#/src/utils/form/getKokeetTaiLisanaytotData';

import { KOULUTUSTYYPIT_WITH_VALINTATAPA } from './constants';
import {
  getKieleistyksetFromValues,
  getSerializedKieleistykset,
} from '../pickTranslations';

const getArrayValue = (values, key) => {
  const valueCandidate = _.get(values, key);
  return isDeepEmptyFormValues(valueCandidate) ? [] : valueCandidate;
};

const serializeTable = ({
  table,
  kielivalinta,
}: {
  table?: TableInputValue;
  kielivalinta: Array<LanguageCode>;
}) => {
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

const serializeSisalto = (
  sisalto?: SisaltoValues,
  kielivalinta: KieliversiotValues = []
) => {
  if (!_.isArray(sisalto)) {
    return [];
  }

  return sisalto.map(sisaltoItem => {
    return {
      tyyppi: sisaltoItem.tyyppi,
      data: match(sisaltoItem)
        .with({ tyyppi: 'teksti', data: P.select() }, data =>
          _.pick(
            _.isObject(data) ? _.mapValues(data, serializeEditorState) : {},
            kielivalinta
          )
        )
        .with({ tyyppi: 'taulukko', data: P.select() }, data =>
          serializeTable({ table: data, kielivalinta })
        )
        .otherwise(() => undefined),
    };
  });
};

export const getValintaperusteByFormValues = (values: ValintaperusteValues) => {
  const { tila, muokkaaja, perustiedot, esikatselu = false } = values;

  const koulutustyyppi = perustiedot?.tyyppi ?? null;
  const julkinen = Boolean(values?.julkinen);

  const hakutapaKoodiUri = perustiedot?.hakutapa;
  const kieleistykset = getKieleistyksetFromValues(perustiedot);
  const kieleistyksetSerialized = getSerializedKieleistykset(perustiedot);
  const kielivalinta = perustiedot?.kieliversiot ?? [];
  const kohdejoukkoKoodiUri = perustiedot?.kohdejoukko?.value ?? null;
  const nimi = kieleistykset(values?.kuvaus?.nimi);

  const kuvaus = kieleistyksetSerialized(values?.kuvaus?.kuvaus);
  const hakukelpoisuus = kieleistyksetSerialized(values?.hakukelpoisuus);
  const lisatiedot = kieleistyksetSerialized(values?.lisatiedot);
  const sisalto = serializeSisalto(values?.kuvaus?.sisalto, kielivalinta);

  const valintatavat = _.includes(
    KOULUTUSTYYPIT_WITH_VALINTATAPA,
    koulutustyyppi
  )
    ? getArrayValue(values, 'valintatavat').map(
        ({
          nimi: valintatapaNimi,
          sisalto: valintatapaSisalto,
          tapa,
          kynnysehto,
          enimmaispistemaara,
          vahimmaispistemaara,
        }) => ({
          nimi: kieleistykset(valintatapaNimi),
          sisalto: serializeSisalto(valintatapaSisalto, kielivalinta),
          valintatapaKoodiUri: tapa?.value,
          kaytaMuuntotaulukkoa: false,
          kynnysehto: kieleistyksetSerialized(kynnysehto),
          enimmaispisteet: isNumeric(enimmaispistemaara)
            ? parseFloatComma(enimmaispistemaara)
            : null,
          vahimmaispisteet: isNumeric(vahimmaispistemaara)
            ? parseFloatComma(vahimmaispistemaara)
            : null,
        })
      )
    : [];

  const valintakokeidenYleiskuvaus = kieleistyksetSerialized(
    values?.valintakokeet?.yleisKuvaus
  );

  const valintakokeet = getKokeetTaiLisanaytotData({
    valintakoeValues: values?.valintakokeet,
    kieleistykset,
    kieleistyksetSerialized,
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
