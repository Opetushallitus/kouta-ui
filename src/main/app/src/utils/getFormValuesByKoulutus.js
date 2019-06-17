export const getFormValuesByKoulutus = koulutus => {
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
    kieliversiot: kielivalinta,
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
    koulutustyyppi,
    lisatiedot: {
      osioKuvaukset,
      osiot,
    },
    description: {
      kuvaus,
      nimi: kuvauksenNimi,
    },
    julkinen,
  };
};

export default getFormValuesByKoulutus;
