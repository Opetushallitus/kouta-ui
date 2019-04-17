import get from 'lodash/get';
import pick from 'lodash/pick';
import set from 'lodash/set';
import merge from 'lodash/merge';

import { JULKAISUTILA, KORKEAKOULUKOULUTUSTYYPIT } from '../../constants';
import { getInvalidTranslations } from '../../utils';

const getKielivalinta = values => get(values, 'kieliversiot.languages') || [];

export const getKoulutusByValues = values => {
  const kielivalinta = getKielivalinta(values);
  const tarjoajat = get(values, 'organization.organizations') || null;
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
    organization: {
      organizations: tarjoajat,
    },
    information: {
      nimi,
      koulutus: {
        value: koulutusKoodiUri,
      },
      opintojenLaajuus: {
        value: opintojenLaajuusKoodiUri,
      },
      tutkintonimike: tutkintonimikeKoodiUrit.map(value => ({ value })),
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

const validateCommon = ({ values }) => {
  const languages = getKielivalinta(values);
  const koulutus = get(values, 'information.koulutus');
  const jarjestajat = get(values, 'organization.organizations') || [];

  const errors = {};

  if (languages.length === 0) {
    set(errors, 'kieliversiot.languages', 'Valitse vähintään yksi kieli');
  }

  if (!koulutus) {
    set(errors, 'information.koulutus', 'Valitse koulutus');
  }

  if (jarjestajat.length === 0) {
    set(
      errors,
      'organization.organizations',
      'Valitse ainakin yksi järjestävä organisaatio',
    );
  }

  return errors;
};

const validateKorkeakoulu = ({ values }) => {
  const errors = {};

  const kielivalinta = getKielivalinta(values);
  const kuvaus = get(values, 'description.kuvaus') || {};

  const invalidKuvausTranslations = getInvalidTranslations(
    kuvaus,
    kielivalinta,
  );

  invalidKuvausTranslations.length > 0 &&
    kielivalinta.forEach(l => {
      set(
        errors,
        ['description', 'kuvaus', l],
        'Valitse kuvaus kaikille käännöksille',
      );
    });

  return errors;
};

export const validate = ({ values, koulutustyyppi, tila }) => {
  if (tila === JULKAISUTILA.TALLENNETTU) {
    return {};
  }

  let errors = validateCommon({ values });

  if (KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi)) {
    errors = merge({}, errors, validateKorkeakoulu({ values }));
  }

  return errors;
};
