import { merge } from 'lodash';

import { type TestiKoulutustyyppi } from '#/playwright/test-types';
import { OpintojenLaajuusyksikko } from '#/src/constants';

const getBaseFields = (tyyppi: TestiKoulutustyyppi = 'amm') => {
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

const getAmmatillinenFields = (tyyppi: TestiKoulutustyyppi) => {
  return merge(getBaseFields(tyyppi), {
    oid: '1.2.246.562.13.00000000000000000599',
    johtaaTutkintoon: false,
    koulutuksetKoodiUri: ['koulutus_351107#12'],
    tila: 'tallennettu',
    tarjoajat: [],
    nimi: {
      en: 'Vocational qualification in Mining',
      fi: 'Kaivosalan perustutkinto',
      sv: 'Grundexamen inom gruvbranschen',
    },
    metadata: {
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

const getKorkeakouluFields = (tyyppi: TestiKoulutustyyppi) => {
  return merge(getBaseFields(tyyppi), {
    johtaaTutkintoon: true,
    koulutuksetKoodiUri: ['koulutus_671112#12'],
    nimi: { fi: 'Fysioterapeutti (AMK)', sv: 'Fysioterapeut (YH)' },
    metadata: {
      kuvaus: { fi: 'Fi kuvaus', sv: 'Sv kuvaus' },
      tutkintonimikeKoodiUrit: ['tutkintonimikekk_1#1', 'tutkintonimikekk_2#1'],
      koulutusalaKoodiUrit: [
        'kansallinenkoulutusluokitus2016koulutusalataso2_052#1',
      ],
    },
  });
};

const getAmmOpeErityisopeJaOpoFields = () => {
  return merge(getBaseFields('amm-ope-erityisope-ja-opo'), {
    johtaaTutkintoon: false,
    koulutuksetKoodiUri: ['koulutus_000001#12'],
    nimi: { fi: 'Ammatillinen opettajankoulutus', sv: 'Yrkeslärarutbildning' },
    metadata: {
      kuvaus: { fi: 'Fi kuvaus', sv: 'Sv kuvaus' },
      tutkintonimikeKoodiUrit: [],
      opintojenLaajuusYksikkoKoodiUri: 'opintojenlaajuusyksikko_2#1',
      opintojenLaajuusNumero: 60,
      koulutusalaKoodiUrit: [
        'kansallinenkoulutusluokitus2016koulutusalataso1_01#1',
      ],
    },
  });
};

const getLukioFields = () => {
  return merge(getBaseFields('lk'), {
    koulutuksetKoodiUri: ['koulutus_309902#7'],
    nimi: { fi: 'Lukion oppimäärä' },
    metadata: {
      opintojenLaajuusYksikkoKoodiUri: 'opintojenlaajuusyksikko_2#1',
      opintojenLaajuusNumero: 150,
    },
  });
};

const getDIAFields = () => {
  return merge(getBaseFields('lk'), {
    koulutuksetKoodiUri: ['koulutus_301103#7'],
    nimi: { fi: 'Deutsche Internationale Abitur; Reifeprüfung' },
  });
};

const getTuvaFields = () => {
  return merge(getBaseFields('tuva'), {
    nimi: { fi: 'Tutkintokoulutukseen valmentava koulutus (TUVA)' },
    metadata: {
      opintojenLaajuusyksikkoKoodiUri: OpintojenLaajuusyksikko.VIIKKO,
      opintojenLaajuusNumero: 38,
      kuvaus: { fi: 'kuvausteksti' },
    },
  });
};

const getTelmaFields = () => {
  return merge(getBaseFields('telma'), {
    nimi: { fi: 'Työhön ja itsenäiseen elämään valmentava koulutus (TELMA)' },
    metadata: {
      opintojenLaajuusyksikkoKoodiUri: OpintojenLaajuusyksikko.OSAAMISPISTE,
      opintojenLaajuusNumero: 60,
      kuvaus: { fi: 'kuvausteksti' },
    },
  });
};

const getVapaaSivistystyoFields = tyyppi => {
  return merge(getBaseFields(tyyppi), {
    nimi: { fi: 'Vapaa Sivistystyö Opistovuosi' },
    metadata: {
      opintojenLaajuusyksikkoKoodiUri: OpintojenLaajuusyksikko.OPINTOPISTE,
      opintojenLaajuusNumero: 53,
      kuvaus: { fi: 'kuvausteksti' },
    },
  });
};

const getVapaaSivistystyoOsaamismerkkiFields = tyyppi => {
  return merge(getBaseFields(tyyppi), {
    nimi: { fi: 'Osaamismerkki: Oma ajankäyttö' },
    metadata: {
      kuvaus: { fi: 'kuvausteksti' },
    },
  });
};

const getMuuAmmatillinenFields = () => {
  return merge(getBaseFields('amm-muu'), {
    nimi: {
      fi: 'Muut ammatilliset koulutukset',
      sv: 'Muut ammatilliset koulutukset',
    },
    metadata: {
      opintojenLaajuusNumero: 12,
      opintojenLaajuusyksikkoKoodiUri: 'opintojenlaajuusyksikko_6#1',
      kuvaus: { fi: 'kuvausteksti' },
    },
  });
};

const getAikuistenPerusopetusFields = () => {
  return merge(getBaseFields('aikuisten-perusopetus'), {
    nimi: { fi: 'Aikuisten perusopetus' },
    metadata: {
      opintojenLaajuusNumero: 13,
      opintojenLaajuusyksikkoKoodiUri: 'opintojenlaajuusyksikko_2#1',
      kuvaus: { fi: 'kuvausteksti' },
    },
  });
};

const getKorkeakoulutusOpintojaksoFields = () => {
  return merge(getBaseFields('kk-opintojakso'), {
    nimi: { fi: 'KK-opintojakso' },
    metadata: {
      opintojenLaajuusNumeroMin: 13,
      opintojenLaajuusNumeroMax: 13,
      opintojenLaajuusyksikkoKoodiUri: 'opintojenlaajuusyksikko_2#1',
      kuvaus: { fi: 'kuvausteksti' },
      osaamistavoitteet: {
        fi: 'Koulutuksen osaamistavoitteet',
        sv: 'Koulutuksen osaamistavoitteet sv',
      },
    },
  });
};

const getEBFields = () => {
  return merge(getBaseFields('lk'), {
    koulutuksetKoodiUri: ['koulutus_301104#7'],
    nimi: { fi: 'EB-tutkinto (European Baccalaureate)' },
  });
};

const getKorkeakoulutusOpintokokonaisuusFields = () => {
  return merge(getBaseFields('kk-opintokokonaisuus'), {
    nimi: { fi: 'KK-opintokokonaisuus' },
    metadata: {
      opintojenLaajuusNumeroMin: '10',
      opintojenLaajuusNumeroMax: '20',
      opintojenLaajuusyksikkoKoodiUri: 'opintojenlaajuusyksikko_2#1',
      kuvaus: { fi: 'kuvausteksti' },
    },
  });
};

const getTaiteenPerusopetusFields = () => {
  return merge(getBaseFields('taiteen-perusopetus'), {
    nimi: { fi: 'Taiteen perusopetus' },
    metadata: {
      kuvaus: { fi: 'kuvausteksti' },
    },
  });
};

export default (tyyppi: TestiKoulutustyyppi = 'amm') => {
  if (tyyppi === 'amm-ope-erityisope-ja-opo') {
    return getAmmOpeErityisopeJaOpoFields();
  } else if (tyyppi === 'amm-muu') {
    return getMuuAmmatillinenFields();
  } else if (tyyppi.startsWith('amm')) {
    return getAmmatillinenFields(tyyppi);
  } else if (['yo', 'amk'].includes(tyyppi)) {
    return getKorkeakouluFields(tyyppi);
  } else if (tyyppi === 'lk') {
    return getLukioFields();
  } else if (tyyppi === 'tuva') {
    return getTuvaFields();
  } else if (tyyppi === 'telma') {
    return getTelmaFields();
  } else if (tyyppi === 'vapaa-sivistystyo-osaamismerkki') {
    return getVapaaSivistystyoOsaamismerkkiFields(tyyppi);
  } else if (tyyppi.startsWith('vapaa-sivistystyo')) {
    return getVapaaSivistystyoFields(tyyppi);
  } else if (tyyppi === 'aikuisten-perusopetus') {
    return getAikuistenPerusopetusFields();
  } else if (tyyppi === 'kk-opintojakso') {
    return getKorkeakoulutusOpintojaksoFields();
  } else if (tyyppi === 'eb') {
    return getEBFields();
  } else if (tyyppi === 'dia') {
    return getDIAFields();
  } else if (tyyppi === 'kk-opintokokonaisuus') {
    return getKorkeakoulutusOpintokokonaisuusFields();
  } else if (tyyppi === 'taiteen-perusopetus') {
    return getTaiteenPerusopetusFields();
  }

  return getBaseFields(tyyppi);
};
