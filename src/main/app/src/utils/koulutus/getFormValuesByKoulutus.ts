import _ from 'lodash/fp';

export const getFormValuesByKoulutus = koulutus => {
  const {
    kielivalinta = [],
    koulutusKoodiUri = '',
    koulutustyyppi = '',
    tarjoajat = [],
    metadata = {},
    nimi = {},
    julkinen = false,
    esikatselu = true,
    tila,
    teemakuva,
    ePerusteId,
  } = koulutus;

  const {
    lisatiedot = [],
    kuvaus = {},
    tutkinnonOsat = [],
    opintojenLaajuusKoodiUri = '',
    tutkintonimikeKoodiUrit = [],
    kuvauksenNimi = {},
    koulutusalaKoodiUrit = [],
  } = metadata;

  return {
    tila,
    kieliversiot: kielivalinta,
    tarjoajat: { tarjoajat, kaytaPohjanJarjestajaa: true },
    information: {
      nimi,
      eperuste: {
        value: ePerusteId,
      },
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
      osioKuvaukset: lisatiedot.reduce((acc, curr) => {
        if (curr.otsikkoKoodiUri) {
          acc[curr.otsikkoKoodiUri] = curr.teksti || {};
        }
        return acc;
      }, {}),
      osiot: lisatiedot
        .filter(({ otsikkoKoodiUri }) => !!otsikkoKoodiUri)
        .map(({ otsikkoKoodiUri }) => ({ value: otsikkoKoodiUri })),
    },
    tutkinnonosat: {
      osat: tutkinnonOsat.map(
        ({
          ePerusteId,
          koulutusKoodiUri,
          tutkinnonosaId,
          tutkinnonosaViite,
        }) => ({
          eperuste: { value: _.toString(ePerusteId) },
          koulutus: { value: koulutusKoodiUri },
          tutkinnonosa: { value: _.toString(tutkinnonosaId) },
          tutkinnonosaviite: _.toString(tutkinnonosaViite),
        })
      ),
      nimi: nimi,
    },
    description: {
      kuvaus,
      nimi: kuvauksenNimi,
    },
    esikatselu,
    julkinen,
    teemakuva,
  };
};

export default getFormValuesByKoulutus;
