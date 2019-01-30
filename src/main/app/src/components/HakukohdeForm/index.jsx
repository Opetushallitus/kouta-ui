import merge from 'lodash/merge';
import getYear from 'date-fns/get_year';
import get from 'lodash/get';
import set from 'lodash/set';
import mapValues from 'lodash/mapValues';
import pick from 'lodash/pick';

import { getInvalidTranslations, parseDate, isValidDate } from '../../utils';
import { getLiiteToimituspaikkaFieldValues } from './utils';

const DATE_FORMAT = 'DD.MM.YYYY HH:mm';

const isValidDateTime = (date, time) => {
  return isValidDate(parseDate(`${date} ${time}`, DATE_FORMAT));
};

const getValintakoeErrors = valintakoe => {
  const errors = {};
  
  const kokeet = get(valintakoe, 'kokeet') || [];

  const invalidValintakokeet = kokeet.filter(
    ({ fromDate, fromTime, toDate, toTime }) =>
      !(isValidDateTime(fromDate, fromTime) && isValidDateTime(toDate, toTime)),
  );

  if (invalidValintakokeet.length > 0) {
    set(errors, 'kokeet._error', 'Tarkista syöttämiesi valintakokeiden tiedot');
  }

  return errors;
}

export { default } from './HakukohdeForm';

export const validate = values => {
  const errors = {};
  
  const kieliversiot = get(values, 'kieliversiot.languages') || [];
  const pohjakoulutusvaatimus = get(values, 'pohjakoulutus.koulutusvaatimus');
  const nimi = get(values, 'perustiedot.nimi');
  const invalidNimiTranslations = getInvalidTranslations(nimi, kieliversiot);
  const eriHakuaika = !!get(values, 'hakuajat.eriHakuaika');
  const hakuajat = get(values, 'hakuajat.hakuajat') || [];

  const invalidHakuajat = eriHakuaika
    ? hakuajat.filter(
        ({ fromDate, fromTime, toDate, toTime }) =>
          !(
            isValidDateTime(fromDate, fromTime) &&
            isValidDateTime(toDate, toTime)
          ),
      )
    : [];

  const alkamiskausi = get(values, 'alkamiskausi.kausi');
  const alkamisvuosi = get(values, 'alkamiskausi.vuosi');
  const aloituspaikat = get(values, 'aloituspaikat.aloituspaikkamaara');
  const valintakoetyypit = get(values, 'valintakoe.types') || [];

  const valintakoeErrors = mapValues(
    pick(get(values, 'valintakoe.kokeet'), valintakoetyypit),
    getValintakoeErrors,
  );

  const liitteet = get(values, 'liitteet.liitteet') || [];

  const liitteillaYhteinentoimitusaika = !!get(
    values,
    'liitteet.yhteinenToimitusaika',
  );

  const invalidLiitteet = liitteet.filter(
    ({ tyyppi, deliverDate, deliverTime }) => {
      return (
        !(
          isValidDateTime(deliverDate, deliverTime) ||
          liitteillaYhteinentoimitusaika
        ) || !get(tyyppi, 'value')
      );
    },
  );

  if (kieliversiot.length === 0) {
    set(errors, 'kieliversiot.languages', 'Valitse ainakin yksi kieli');
  }

  if (!pohjakoulutusvaatimus) {
    set(
      errors,
      'pohjakoulutus.koulutusvaatimus',
      'Valitse pohjakoulutusvaatimus',
    );
  }

  if (!nimi || invalidNimiTranslations.length > 0) {
    set(
      errors,
      'perustiedot.nimi',
      'Syötä nimi kaikille valituille kieliversioille',
    );
  }

  if (eriHakuaika && invalidHakuajat.length > 0) {
    set(
      errors,
      'hakuajat.hakuajat._error',
      'Tarkista syöttämiesi hakuaikojen päivämäärät ja kellonajat',
    );
  }

  if (!alkamiskausi) {
    set(errors, 'alkamiskausi.kausi', 'Valitse alkamiskausi');
  }

  if (!alkamisvuosi) {
    set(errors, 'alkamiskausi.vuosi', 'Valitse alkamisvuosi');
  }

  if (isNaN(parseInt(aloituspaikat))) {
    set(
      errors,
      'aloituspaikat.aloituspaikkamaara',
      'Syötä aloituspaikkojen lukumäärä',
    );
  }

  set(
    errors,
    'valintakoe.kokeet',
    valintakoeErrors,
  );

  if (invalidLiitteet.length > 0) {
    set(
      errors,
      'liitteet.liitteet._error',
      'Tarkista syöttämiesi liitteiden tiedot',
    );
  }

  return errors;
};

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
