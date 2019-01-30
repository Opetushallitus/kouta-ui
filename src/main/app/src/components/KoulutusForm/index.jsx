import get from 'lodash/get';
import set from 'lodash/set';

export { default } from './KoulutusForm';

export const validate = values => {
  const languages = Object.keys(values.language || {}).filter(
    k => !!values.language[k],
  );

  const koulutus = get(values, 'information.koulutus');
  const jarjestajat = get(values, 'organization.organizations');

  const errors = {};

  if (languages.length === 0) {
    set(errors, 'language.fi', 'Valitse vähintään yksi kieli');
  }

  if (!koulutus) {
    set(errors, 'information.koulutus', 'Valitse koulutus');
  }

  if (!jarjestajat || jarjestajat.length === 0) {
    set(
      errors,
      'organization.organizations',
      'Valitse ainakin yksi järjestävä organisaatio',
    );
  }

  return errors;
};