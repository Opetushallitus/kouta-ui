import _ from 'lodash';

const getBaseFields = ({ tyyppi = 'amm' } = {}) => {
  return {
    oid: '1.2.246.562.13.00000000000000000072',
    koulutustyyppi: tyyppi,
    koulutuksetKoodiUri: ['koulutus_0#1'],
    tila: 'tallennettu',
    tarjoajat: ['1.2.246.562.10.81934895871'],
    nimi: {
      en: 'Vocational qualification in Agriculture',
      fi: 'Maatalousalan perustutkinto',
      sv: 'Grundexamen inom lantbruksbranschen',
    },
    metadata: {
      tyyppi: tyyppi,
      kuvaus: {},
      lisatiedot: [
        {
          otsikkoKoodiUri: 'koulutuksenlisatiedot_0#1',
          teksti: {
            fi: 'koulutuksenlisatiedot_0 kuvaus',
          },
        },
      ],
    },
    julkinen: true,
    muokkaaja: '1.2.246.562.24.62301161440',
    organisaatioOid: '1.2.246.562.10.594252633210',
    kielivalinta: ['fi', 'sv'],
    modified: '2019-04-01T13:01',
  };
};

const getAmmatillinenFields = ({ tyyppi = 'amm' }) => {
  return _.merge(getBaseFields(), {
    oid: '1.2.246.562.13.00000000000000000599',
    johtaaTutkintoon: false,
    koulutustyyppi: tyyppi,
    koulutuksetKoodiUri: ['koulutus_351107#12'],
    tila: 'tallennettu',
    tarjoajat: [],
    nimi: {
      en: 'Vocational qualification in Mining',
      fi: 'Kaivosalan perustutkinto',
      sv: 'Grundexamen inom gruvbranschen',
    },
    metadata: {
      tyyppi: tyyppi,
      kuvaus: {},
      lisatiedot: [],
    },
    julkinen: true,
    esikatselu: true,
    muokkaaja: '1.2.246.562.24.26603962037',
    organisaatioOid: '1.2.246.562.10.60198812368',
    kielivalinta: ['fi', 'sv'],
    ePerusteId: 6777660,
    modified: '2020-09-21T16:27',
  });
};

const getKorkeakouluFields = ({ tyyppi }) => {
  return _.merge(getBaseFields(), {
    johtaaTutkintoon: true,
    koulutustyyppi: tyyppi,
    koulutuksetKoodiUri: ['koulutus_671112#12'],
    nimi: { fi: 'Fysioterapeutti (AMK)', sv: 'Fysioterapeut (YH)' },
    metadata: {
      tyyppi,
      kuvaus: { fi: 'Fi kuvaus', sv: 'Sv kuvaus' },
      tutkintonimikeKoodiUrit: ['tutkintonimikekk_1#1', 'tutkintonimikekk_2#1'],
      opintojenLaajuusKoodiUri: 'opintojenlaajuus_1#1',
      kuvauksenNimi: { fi: 'Fi kuvauksen nimi', sv: 'Sv kuvauksen nimi' },
      koulutusalaKoodiUrit: [
        'kansallinenkoulutusluokitus2016koulutusalataso2_1#1',
      ],
    },
  });
};

const getLukioFields = ({ tyyppi }) => {
  return _.merge(getBaseFields({ tyyppi }), {
    koulutuksetKoodiUri: ['koulutus_309902#12'],
    nimi: { fi: 'Lukion oppimäärä' },
  });
};

export default ({ tyyppi = 'amm' } = {}) => {
  if (tyyppi.startsWith('amm')) {
    return getAmmatillinenFields({ tyyppi });
  } else if (['yo', 'amk'].includes(tyyppi)) {
    return getKorkeakouluFields({ tyyppi });
  } else if (tyyppi === 'lk') {
    return getLukioFields({ tyyppi });
  }

  return getBaseFields();
};
