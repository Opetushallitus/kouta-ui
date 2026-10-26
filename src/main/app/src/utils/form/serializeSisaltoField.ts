import { produce } from 'immer';
import { isObject, mapValues, pick } from 'lodash-es';
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

export const serializeSisaltoField = (
  sisalto: SisaltoValues,
  kielivalinta: KieliversiotValues
) => {
  if (!Array.isArray(sisalto)) {
    return [];
  }

  return sisalto.map(sisaltoItem => ({
    tyyppi: sisaltoItem.tyyppi,
    data: match(sisaltoItem)
      .with({ tyyppi: 'teksti', data: P.select() }, data =>
        pick(
          isObject(data) ? mapValues(data, serializeEditorState) : {},
          kielivalinta
        )
      )
      .with({ tyyppi: 'taulukko', data: P.select() }, data =>
        serializeTable({ table: data, kielivalinta })
      )
      .otherwise(() => undefined),
  }));
};
