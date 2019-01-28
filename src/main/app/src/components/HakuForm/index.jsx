import get from 'lodash/get';
import set from 'lodash/set';

import { getInvalidTranslations, parseDate, isValidDate } from '../../utils';

const DATE_FORMAT = 'DD.MM.YYYY HH:mm';

const isValidDateTime = (date, time) => {
  return isValidDate(parseDate(`${date} ${time}`, DATE_FORMAT));
};

export { default } from './HakuForm';

export const validate = values => {

  const errors = {};
  
  const kieliversiot = get(values, 'kieliversiot.languages') || [];

  const nimi = get(values, 'nimi.nimi');

  const invalidNimiTranslations = getInvalidTranslations(nimi, kieliversiot);

  const alkamiskausi = get(values, 'aikataulut.kausi');

  const alkamisvuosi = get(values, 'aikataulut.vuosi');

  const hakutapaKoodiUri = get(values, 'hakutapa.tapa') || [];

  const hakulomaketyyppi = get(values, 'hakulomake.lomaketyyppi') || [];

  const hakulomake = get(values, 'hakulomake.lomake') || [];

  const hakukohteenLiittamisenTakarajaPVM = get(values, 'aikataulut.liittäminen_pvm');

  const hakukohteenLiittamisenTakarajaAika = get(values, 'aikataulut.liittäminen_aika');

  const hakukohteenLiittamisenTakaraja = isValidDateTime(hakukohteenLiittamisenTakarajaPVM, hakukohteenLiittamisenTakarajaAika);

  const kohdejoukkoKoodiUri = get(values, 'kohdejoukko.kohde') || [];

  const metaNimi = get(values, 'yhteystiedot.nimi');

  const metaTitteli = get(values, 'yhteystiedot.titteli');

  const metaSahkoposti = get(values, 'yhteystiedot.email');

  const metaPuhelinnumero = get(values, 'yhteystiedot.numero');

  const hakukohteenMuokkaamisenTakarajaPVM = get(values, 'aikataulut.muokkaus_pvm');

  const hakukohteenMuokkaamisenTakarajaAika = get(values, 'aikataulut.muokkaus_aika');

  const hakukohteenMuokkaamisenTakaraja = isValidDateTime(hakukohteenMuokkaamisenTakarajaPVM, hakukohteenMuokkaamisenTakarajaAika);

  const hakuajat = get(values, 'aikataulut.hakuajat') || [];

  const invalidHakuajat = hakuajat.filter(
        ({ fromDate, fromTime, toDate, toTime }) =>
          !(
            isValidDateTime(fromDate, fromTime) &&
            isValidDateTime(toDate, toTime)
          ),
      )
      || [];


  if (kieliversiot.length === 0) {
    set(errors, 'kieliversiot.languages', 'Valitse ainakin yksi kieli');
  }

  if (!nimi || invalidNimiTranslations.length > 0) {
    set(
      errors,
      'nimi.nimi',
      'Syötä nimi kaikille valituille kieliversioille',
    );
  }

  if (invalidHakuajat.length > 0) {
    set(
      errors,
      'aikataulut.hakuajat._error',
      'Tarkista syöttämiesi hakuaikojen päivämäärät ja kellonajat',
    );
  }

  if (!hakukohteenMuokkaamisenTakaraja) {
    set(
      errors,
      'hakuajat._error',
      'Tarkista syöttämiesi hakuaikojen päivämäärät ja kellonajat',
    );
  }

  if (!hakukohteenLiittamisenTakaraja) {
    set(
      errors,
      'hakuajat._error',
      'Tarkista syöttämiesi hakuaikojen päivämäärät ja kellonajat',
    );
  }

  if (!alkamiskausi) {
    set(errors, 'aikataulut.kausi', 'Valitse alkamiskausi');
  }

  if (!alkamisvuosi) {
    set(errors, 'aikataulut.vuosi', 'Valitse alkamisvuosi');
  }

  if (!hakutapaKoodiUri) {
    set(errors, 'hakutapa.tapa', 'Valitse hakutapa');
  }

  if (!hakulomaketyyppi) {
    set(errors, 'hakulomake.lomaketyyppi', 'Valitse hakulomaketyyppi');
  }

  if (!hakulomake) {
    set(errors, 'hakulomake.lomake', 'Valitse hakulomake');
  }

  if (!kohdejoukkoKoodiUri) {
    set(errors, 'kohdejoukko.kohde', 'Valitse kohdejoukko');
  }

  if (!metaNimi) {
    set(errors, 'yhteystiedot.nimi', 'Anna yhteystietoihin nimi');
  }

  if (!metaTitteli) {
    set(errors, 'yhteystiedot.titteli', 'Anna yhteystietoihin titteli');
  }

  if (!metaSahkoposti) {
    set(errors, 'yhteystiedot.email', 'Anna yhteystietoihin sähköpostiosoite');
  }

  if (!metaPuhelinnumero) {
    set(errors, 'yhteystiedot.numero', 'Anna yhteystietoihin puhleinnumero');
  }

  return errors;
};

