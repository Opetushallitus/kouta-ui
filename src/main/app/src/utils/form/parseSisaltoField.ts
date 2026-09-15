import _ from 'lodash';
import { match, P } from 'ts-pattern';

import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import {
  SisaltoModel,
  SisaltoItem,
  TekstiModel,
} from '#/src/types/domainTypes';
import {
  Sisalto,
  SisaltoTaulukkoValue,
  SisaltoTekstiValue,
  SisaltoValues,
} from '#/src/types/formTypes';

export const parseSisaltoField = (sisalto?: SisaltoModel): SisaltoValues => {
  if (!_.isArray(sisalto)) {
    return [];
  }

  return sisalto.map((sisaltoItem: SisaltoItem): Sisalto => {
    // id for sortable list, not sent to backend
    const id = crypto.randomUUID();
    return match(sisaltoItem)
      .with(
        { tyyppi: 'teksti', data: P.select() },
        (data?: TekstiModel): SisaltoTekstiValue =>
          ({
            tyyppi: 'teksti',
            data: _.isObject(data)
              ? _.mapValues(data, parseEditorState)
              : undefined,
            id,
          }) as SisaltoTekstiValue
      )
      .otherwise(
        ({ data }: SisaltoItem): SisaltoTaulukkoValue =>
          ({
            tyyppi: 'taulukko',
            data,
            id,
          }) as SisaltoTaulukkoValue
      );
  });
};
