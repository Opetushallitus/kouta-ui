import { curry } from 'lodash-es';

import { OrganisaatioModel } from '#/src/types/domainTypes';
import { valueToArray } from '#/src/utils';

export const organisaatioMatchesTyyppi = curry(
  (tyyppi: string | Array<string>, organisaatio: OrganisaatioModel) => {
    const tyypit = valueToArray(tyyppi);
    const orgTyypit = organisaatio?.organisaatiotyyppiUris || [];
    return orgTyypit.some(t => tyypit.includes(t));
  }
);
