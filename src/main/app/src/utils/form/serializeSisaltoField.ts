import produce from 'immer';
import _ from 'lodash';
import { match, P } from 'ts-pattern';

import { serializeEditorState } from '#/src/components/LexicalEditorUI/utils';
import { Kielivalinta } from '#/src/types/domainTypes';
import {
  KieliversiotValues,
  SisaltoTaulukkoValue,
  SisaltoValues,
} from '#/src/types/formTypes';

const serializeTable = ({
  table,
  kielivalinta,
}: {
  table: SisaltoTaulukkoValue['data'];
  kielivalinta: Kielivalinta;
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

export const serializeSisaltoField = (
  sisalto: SisaltoValues,
  kielivalinta: KieliversiotValues
) => {
  if (!_.isArray(sisalto)) {
    return [];
  }

  return sisalto.map(sisaltoItem => ({
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
  }));
};
