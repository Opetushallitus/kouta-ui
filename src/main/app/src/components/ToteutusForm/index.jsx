import get from 'lodash/get';
import set from 'lodash/set';

export { default } from './ToteutusForm';

export const initialValues = {
  kieliversiot: {
    languages: ['fi', 'sv'],
  },
  jarjestamistiedot: {
    opetuskieli: ['fi'],
    opetusaika: 'paivaopetus',
    opetustapa: 'lahiopiskelu',
    maksullisuus: 'ei',
  },
};

export const validate = values => {
  const errors = {};

  const kieliversiot = get(values, 'kieliversiot.languages') || [];
  const osaamisalat = get(values, 'osaamisalat.osaamisalat') || [];
  const jarjestajat = get(values, 'jarjestamispaikat.jarjestajat') || [];

  if (kieliversiot.length === 0) {
    set(errors, 'kieliversiot.langues', 'Valitse vähintään yksi kieli');
  }

  if (osaamisalat.length === 0) {
    set(errors, 'osaamisalat.osaamisalat', 'Valitse vähintään yksi osaamisala');
  }

  if (jarjestajat.length === 0) {
    set(errors, 'jarjestamispaikat.jarjestajat', 'Valitse vähintään yksi järjestäjä');
  }

  return errors;
}