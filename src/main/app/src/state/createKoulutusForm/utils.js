import get from 'lodash/get';

export const getKoulutusByValues = values => {
  const kielivalinta = get(values, 'kieliversiot.languages') || [];
  const tarjoajat = get(values, 'organization.organizations') || null;
  const koulutusKoodiUri = get(values, 'information.koulutus.value') || null;
  const koulutustyyppi = get(values, 'type.type') || null;
  const osiot = get(values, 'lisatiedot.osiot') || [];
  const osioKuvaukset = get(values, 'lisatiedot.osioKuvaukset') || {};

  const osiotWithKuvaukset = osiot
    .map(({ value }) => ({
      otsikkoKoodiUri: value,
      teksti: osioKuvaukset[value],
    }))
    .filter(({ teksti }) => !!teksti);

  return {
    kielivalinta,
    tarjoajat,
    koulutusKoodiUri,
    koulutustyyppi,
    metadata: {
      lisatiedot: osiotWithKuvaukset,
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
  } = koulutus;

  const { lisatiedot = [] } = metadata;

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
      koulutus: {
        value: koulutusKoodiUri,
      },
    },
    type: {
      type: koulutustyyppi,
    },
    lisatiedot: {
      osioKuvaukset,
      osiot,
    },
  };
};
