import _ from 'lodash';
import { match, P } from 'ts-pattern';

import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import { SisaltoModel } from '#/src/types/domainTypes';
import {
  SisaltoTaulukkoValue,
  SisaltoTekstiValue,
  SisaltoValues,
} from '#/src/types/formTypes';

export const parseSisaltoField = (sisalto?: SisaltoModel): SisaltoValues => {
  if (!_.isArray(sisalto)) {
    return [];
  }

  return sisalto.map(sisaltoItem => {
    return match(sisaltoItem)
      .with(
        { tyyppi: 'teksti', data: P.select() },
        data =>
          ({
            tyyppi: 'teksti',
            data: _.isObject(data)
              ? _.mapValues(data, parseEditorState)
              : undefined,
          }) as SisaltoTekstiValue
      )
      .otherwise(
        ({ data }) =>
          ({
            tyyppi: 'taulukko',
            data,
          }) as SisaltoTaulukkoValue
      );
  });
};
