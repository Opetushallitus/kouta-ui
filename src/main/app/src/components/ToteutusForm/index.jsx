import get from 'lodash/get';
import set from 'lodash/set';

export { default } from './ToteutusForm';

export const initialValues = {
  kieliversiot: {
    languages: ['fi', 'sv'],
  },
  jarjestamistiedot: {
    maksullisuus: 'ei',
  },
};

export const validate = values => {
  const errors = {};

  const kieliversiot = get(values, 'kieliversiot.languages') || [];
  const jarjestajat = get(values, 'jarjestamispaikat.jarjestajat') || [];
  const opetuskielet = get(values, 'jarjestamistiedot.opetuskieli') || [];
  const opetustapa = get(values, 'jarjestamistiedot.opetustapa');
  const opetusaika = get(values, 'jarjestamistiedot.opetusaika');

  if (kieliversiot.length === 0) {
    set(errors, 'kieliversiot.langues', 'Valitse vähintään yksi kieli');
  }

  if (jarjestajat.length === 0) {
    set(errors, 'jarjestamispaikat.jarjestajat', 'Valitse vähintään yksi järjestäjä');
  }

  if (opetuskielet.length === 0) {
    set(errors, 'jarjestamistiedot.opetuskieli', 'Valitse vähintään yksi opetuskieli');
  }

  if (!opetustapa) {
    set(errors, 'jarjestamistiedot.opetustapa', 'Valitse opetustapa');
  }

  if (!opetusaika) {
    set(errors, 'jarjestamistiedot.opetusaika', 'Valitse opetusaika');
  }

  return errors;
}
