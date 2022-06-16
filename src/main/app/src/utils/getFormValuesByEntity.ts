import { ENTITY } from '#/src/constants';

import { getFormValuesByHaku } from './haku/getFormValuesByHaku';
import { getFormValuesByHakukohde } from './hakukohde/getFormValuesByHakukohde';
import getFormValuesByKoulutus from './koulutus/getFormValuesByKoulutus';
import getFormValuesByToteutus from './toteutus/getFormValuesByToteutus';
import { getFormValuesByValintaperuste } from './valintaperuste/getFormValuesByValintaperuste';

const GETTER_BY_ENTITY = {
  [ENTITY.KOULUTUS]: getFormValuesByKoulutus,
  [ENTITY.TOTEUTUS]: getFormValuesByToteutus,
  [ENTITY.HAKU]: getFormValuesByHaku,
  [ENTITY.HAKUKOHDE]: getFormValuesByHakukohde,
  [ENTITY.VALINTAPERUSTE]: getFormValuesByValintaperuste,
};

export const getFormValuesByEntity = (entity: ENTITY, domainObject: any) =>
  GETTER_BY_ENTITY[entity](domainObject);
