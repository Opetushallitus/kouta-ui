import get from 'lodash/get';

export const getKoulutusByValues = values => {
  const kielivalinta = get(values, 'kieliversiot.languages') || [];
  const tarjoajat = get(values, 'organization.organizations') || null;
  const koulutusKoodiUri = get(values, 'information.koulutus.value') || null;
  const koulutustyyppi = get(values, 'type.type') || null;

  return {
    kielivalinta,
    tarjoajat,
    koulutusKoodiUri,
    koulutustyyppi,
  };
};

export const getValuesByKoulutus = koulutus => {
  const {
    kielivalinta = [],
    koulutusKoodiUri = '',
    koulutustyyppi = '',
    tarjoajat = [],
  } = koulutus;

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
  };
};
