import get from 'lodash/get';

export const getKoulutusByValues = values => {
  const kielivalinta = get(values, 'kieliversiot.languages') || [];
  const tarjoajat = get(values, 'organization.organizations') || null;
  const koulutusKoodiUri = get(values, 'information.koulutus.value') || null;
  const koulutustyyppi = get(values, 'type.type') || null;
  const osiot = get(values, 'lisatiedot.osiot') || [];
  const osioKuvaukset = get(values, 'lisatiedot.osioKuvaukset') || {};

  const osiotWithKuvaukset = osiot
    .map(({ value }) => ({ koodiUri: value, teksti: osioKuvaukset[value] }))
    .filter(({ teksti }) => !!teksti);

  return {
    kielivalinta,
    tarjoajat,
    koulutusKoodiUri,
    koulutustyyppi,
    osiot: osiotWithKuvaukset,
  };
};

export const getValuesByKoulutus = koulutus => {
  const {
    kielivalinta = [],
    koulutusKoodiUri = '',
    koulutustyyppi = '',
    tarjoajat = [],
    osiot: osiotArg = [],
  } = koulutus;

  const osiot = osiotArg
    .filter(({ koodiUri }) => !!koodiUri)
    .map(({ koodiUri }) => ({ value: koodiUri }));

  const osioKuvaukset = osiotArg.reduce((acc, curr) => {
    if (curr.koodiUri) {
      acc[curr.koodiUri] = curr.teksti || {};
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
