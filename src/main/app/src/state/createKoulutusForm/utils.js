import get from 'lodash/get';
import pick from 'lodash/pick';

export const getKoulutusByValues = values => {
  const kielivalinta = get(values, 'kieliversiot.languages') || [];
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
    get(values, 'information.opintojenLaajuus') || null;

  const tutkintonimikeKoodiUrit = (
    get(values, 'information.tutkintonimike') || []
  ).map(({ value }) => value);

  const kuvauksenNimi = pick(
    get(values, 'description.nimi') || {},
    kielivalinta,
  );

  return {
    kielivalinta,
    tarjoajat,
    koulutusKoodiUri,
    koulutustyyppi,
    nimi,
    metadata: {
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
  };
};
