import _fp from 'lodash/fp';

import { Organisaatio } from '#/src/types/domainTypes';
import { valueToArray } from '#/src/utils';

export const organisaatioMatchesTyyppi = _fp.curry(
  (tyyppi: string, organisaatio: Organisaatio) => {
    const tyypit = valueToArray(tyyppi);
    const orgTyypit = organisaatio?.organisaatiotyyppiUris || [];
    return orgTyypit.some(t => tyypit.includes(t));
  }
);
