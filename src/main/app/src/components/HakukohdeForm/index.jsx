import merge from 'lodash/merge';
import getYear from 'date-fns/get_year';

import { getLiiteToimituspaikkaFieldValues } from './utils';

export { default } from './HakukohdeForm';

export const initialValues = {
  kieliversiot: {
    languages: ['fi', 'sv'],
  },
  alkamiskausi: {
    vuosi: getYear(new Date()).toString(),
  },
};

export const getInitialValues = ({ organisaatio }) => {
  return merge({}, initialValues, {
    liitteet: getLiiteToimituspaikkaFieldValues({
      organisaatio,
      language: 'fi',
    }),
  });
};
