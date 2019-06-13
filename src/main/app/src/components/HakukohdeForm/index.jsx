import merge from 'lodash/merge';
import getYear from 'date-fns/get_year';

export { default } from './HakukohdeForm';

export const initialValues = {
  kieliversiot: ['fi', 'sv'],
  alkamiskausi: {
    vuosi: getYear(new Date()).toString(),
  },
};

export const getInitialValues = () => {
  return merge({}, initialValues);
};
