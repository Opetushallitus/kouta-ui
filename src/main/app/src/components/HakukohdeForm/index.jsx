import getYear from 'date-fns/getYear';

export { default } from './HakukohdeForm';

export const initialValues = {
  kieliversiot: ['fi', 'sv'],
  alkamiskausi: {
    vuosi: getYear(new Date()).toString(),
  },
};
