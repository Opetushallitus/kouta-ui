import get from 'lodash/get';
import pick from 'lodash/pick';

import { JULKAISUTILA, KORKEAKOULUKOULUTUSTYYPIT } from '../../constants';
import { ErrorBuilder } from '../../validation';

const getKielivalinta = values => get(values, 'kieliversiot.languages') || [];

export const getKoulutusByValues = values => {
  const kielivalinta = getKielivalinta(values);
  const tarjoajat = get(values, 'tarjoajat') || [];
  const koulutusKoodiUri = get(values, 'information.koulutus.value') || null;
  const koulutustyyppi = get(values, 'type.type') || null;
  const osiot = get(values, 'lisatiedot.osiot') || [];
  const osioKuvaukset = get(values, 'lisatiedot.osioKuvaukset') || {};

  const osiotWithKuvaukset = osiot.map(({ value }) => ({
    otsikkoKoodiUri: value,
    teksti: pick(osioKuvaukset[value] || {}, kielivalinta),
  }));

  const kuvaus = pick(get(values, 'description.kuvaus') || {}, kielivalinta);
  const nimi = pick(get(values, 'information.nimi') || {}, kielivalinta);
  const opintojenLaajuusKoodiUri =
    get(values, 'information.opintojenLaajuus.value') || null;

  const tutkintonimikeKoodiUrit = (
    get(values, 'information.tutkintonimike') || []
  ).map(({ value }) => value);

  const koulutusalaKoodiUrit = (
    get(values, 'information.koulutusalat') || []
  ).map(({ value }) => value);

  const kuvauksenNimi = pick(
    get(values, 'description.nimi') || {},
    kielivalinta,
  );

  const julkinen = Boolean(get(values, 'nakyvyys.julkinen'));

  return {
    kielivalinta,
    tarjoajat,
    koulutusKoodiUri,
    koulutustyyppi,
    nimi,
    julkinen,
    metadata: {
      tyyppi: koulutustyyppi,
      lisatiedot: osiotWithKuvaukset,
      kuvaus,
      opintojenLaajuusKoodiUri,
      tutkintonimikeKoodiUrit,
      kuvauksenNimi,
      koulutusalaKoodiUrit,
    },
  };
};

export const getValuesByKoulutus = koulutus => {
  const {
    kielivalinta = [],
    koulutusKoodiUri = '',
    koulutustyyppi = '',
    tarjoajat = [],
    metadata = {},
    nimi = {},
    julkinen = false,
  } = koulutus;

  const {
    lisatiedot = [],
    kuvaus = {},
    opintojenLaajuusKoodiUri = '',
    tutkintonimikeKoodiUrit = [],
    kuvauksenNimi = {},
    koulutusalaKoodiUrit = [],
  } = metadata;

  const osiot = lisatiedot
    .filter(({ otsikkoKoodiUri }) => !!otsikkoKoodiUri)
    .map(({ otsikkoKoodiUri }) => ({ value: otsikkoKoodiUri }));

  const osioKuvaukset = lisatiedot.reduce((acc, curr) => {
    if (curr.otsikkoKoodiUri) {
      acc[curr.otsikkoKoodiUri] = curr.teksti || {};
    }

    return acc;
  }, {});

  return {
    kieliversiot: {
      languages: kielivalinta,
    },
    tarjoajat,
    information: {
      nimi,
      koulutus: {
        value: koulutusKoodiUri,
      },
      opintojenLaajuus: {
        value: opintojenLaajuusKoodiUri,
      },
      tutkintonimike: tutkintonimikeKoodiUrit.map(value => ({ value })),
      koulutusalat: koulutusalaKoodiUrit.map(value => ({ value })),
    },
    type: {
      type: koulutustyyppi,
    },
    lisatiedot: {
      osioKuvaukset,
      osiot,
    },
    description: {
      kuvaus,
      nimi: kuvauksenNimi,
    },
    nakyvyys: {
      julkinen,
    },
  };
};

const validateEssentials = ({ errorBuilder }) => {
  return errorBuilder
    .validateArrayMinLength('kieliversiot.languages', 1)
    .validateExistence('information.koulutus');
};

const validateCommon = ({ errorBuilder }) => {
  return errorBuilder.validateArrayMinLength('tarjoajat', 1);
};

const validateKorkeakoulu = ({ values, errorBuilder }) => {
  const kielivalinta = getKielivalinta(values);

  return errorBuilder.validateTranslations('description.kuvaus', kielivalinta);
};

export const validate = ({ values, koulutustyyppi, tila }) => {
  let errorBuilder = new ErrorBuilder({ values });

  errorBuilder = validateEssentials({ errorBuilder, values });

  if (tila === JULKAISUTILA.TALLENNETTU) {
    return errorBuilder.getErrors();
  }

  errorBuilder = validateCommon({ values, errorBuilder });

  if (KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi)) {
    errorBuilder = validateKorkeakoulu({ values, errorBuilder });
  }

  return errorBuilder.getErrors();
};
