import { merge } from 'lodash';

const getBaseFields = () => {
  return {
    oid: '1.2.246.562.13.00000000000000000072',
    koulutustyyppi: 'amm',
    koulutusKoodiUri: 'koulutus_0#1',
    tila: 'tallennettu',
    tarjoajat: ['1.2.246.562.10.81934895871'],
    nimi: {
      en: 'Vocational qualification in Agriculture',
      fi: 'Maatalousalan perustutkinto',
      sv: 'Grundexamen inom lantbruksbranschen',
    },
    metadata: {
      tyyppi: 'amm',
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

const getAmmatillinenFields = ({ tyyppi }) => {
  return merge(getBaseFields(), {
    koulutustyyppi: tyyppi,
    koulutusKoodiUri: 'koulutus_0#1',
    tila: 'tallennettu',
    nimi: {
      en: 'Vocational qualification in Agriculture',
      fi: 'Maatalousalan perustutkinto',
      sv: 'Grundexamen inom lantbruksbranschen',
    },
    metadata: { tyyppi },
  });
};

const getKorkeakouluFields = ({ tyyppi }) => {
  return merge(getBaseFields(), {
    johtaaTutkintoon: true,
    koulutustyyppi: tyyppi,
    koulutusKoodiUri: 'koulutus_0#1',
    nimi: { fi: 'Fi nimi', sv: 'Sv nimi' },
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

const getLukioFields = ({ tyyppi }) => getAmmatillinenFields({ tyyppi });

export default ({ tyyppi = 'amm' } = {}) => {
  if (tyyppi === 'amm') {
    return getAmmatillinenFields({ tyyppi });
  } else if (['yo', 'amk'].includes(tyyppi)) {
    return getKorkeakouluFields({ tyyppi });
  } else if (tyyppi === 'lk') {
    return getLukioFields({ tyyppi });
  }

  return getBaseFields();
};
