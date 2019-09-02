import getYear from 'date-fns/getYear';

import { DEFAULT_JULKAISUTILA } from '../../constants';

export { default } from './HakukohdeForm';

export const initialValues = {
  tila: DEFAULT_JULKAISUTILA,
  kieliversiot: ['fi', 'sv'],
  alkamiskausi: {
    vuosi: getYear(new Date()).toString(),
  },
};
