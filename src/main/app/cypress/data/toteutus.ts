import { merge } from 'lodash/fp';

import { Alkamiskausityyppi, ApurahaYksikko } from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';

const getBaseFields = ({ tyyppi }) => ({
  oid: '1.2.246.562.17.00000000000000000026',
  koulutusOid: '1.2.246.562.13.00000000000000000041',
  tila: 'tallennettu',
  esikatselu: false,
  tarjoajat: ['1.2.246.562.10.74534804344'],
  nimi: { fi: 'Koulutuskeskus Salpaus, jatkuva haku, eläintenhoitaja' },
  metadata: {
    tyyppi,
    kuvaus: {},
    opetus: {
      opetuskieliKoodiUrit: ['oppilaitoksenopetuskieli_1#1'],
      opetuskieletKuvaus: {
        fi: 'Opetuskieli kuvaus',
      },
      suunniteltuKestoKuvaus: {
        fi: 'Fi suunniteltuKestoKuvaus',
        sv: 'Sv suunniteltuKestoKuvaus',
      },
      suunniteltuKestoVuodet: 2,
      suunniteltuKestoKuukaudet: 6,
      opetusaikaKoodiUrit: ['opetusaikakk_1#1'],
      opetusaikaKuvaus: {
        fi: 'Opetusaika kuvaus',
      },
      opetustapaKoodiUrit: ['opetuspaikkakk_1#1'],
      opetustapaKuvaus: {
        fi: 'Opetustapa kuvaus',
      },
      maksullisuustyyppi: MaksullisuusTyyppi.MAKSULLINEN,
      maksullisuusKuvaus: {
        fi: 'Maksullisuus kuvaus',
      },
      maksunMaara: 20,
      koulutuksenAlkamiskausi: {
        alkamiskausityyppi: Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA,
        koulutuksenAlkamispaivamaara: '2021-04-16T00:00',
        koulutuksenPaattymispaivamaara: '2021-12-12T00:00',
      },
      onkoApuraha: true,
      apuraha: {
        kuvaus: {
          fi: 'Stipendin kuvaus',
        },
        min: 100,
        max: 200,
        yksikko: ApurahaYksikko.EURO,
      },
      lisatiedot: [
        {
          otsikkoKoodiUri: 'koulutuksenlisatiedot_0#1',
          teksti: {
            fi: 'koulutuksenlisatiedot_0 kuvaus',
          },
        },
      ],
    },
    asiasanat: [
      { kieli: 'fi', arvo: 'koira' },
      { kieli: 'fi', arvo: 'eläintenhoito' },
    ],
    ammattinimikkeet: [{ kieli: 'fi', arvo: 'eläintenhoitaja' }],
    yhteyshenkilot: [
      {
        nimi: {
          fi: 'Fi nimi',
          sv: 'Sv nimi',
        },
        puhelinnumero: {
          fi: 'Fi puhelinnumero',
          sv: 'Sv puhelinnumero',
        },
        sahkoposti: {
          fi: 'Fi sähköposti',
          sv: 'Sv sähköposti',
        },
        titteli: {
          fi: 'Fi titteli',
          sv: 'Sv titteli',
        },
        wwwSivu: {
          fi: 'http://fi-verkkosivu',
          sv: 'http://sv-verkkosivu',
        },
      },
    ],
  },
  muokkaaja: '1.2.246.562.24.62301161440',
  organisaatioOid: '1.2.246.562.10.594252633210',
  kielivalinta: ['fi', 'sv'],
  modified: '2019-03-26T10:19',
});

const getAmmatillinenFields = ({ tyyppi }) =>
  merge(getBaseFields({ tyyppi }), {
    metadata: {
      tyyppi,
      osaamisalat: [
        {
          koodiUri: 'osaamisala_0',
          linkki: {
            fi: 'https://www.salpaus.fi/koulutusesittely/elaintenhoitaja/',
          },
          otsikko: {
            fi: 'Otsikko',
          },
        },
      ],
    },
  });

const getLukioFields = ({ tyyppi }) =>
  merge(getBaseFields({ tyyppi }), {
    nimi: {},
    metadata: {
      tyyppi,
      yleislinja: true,
      opetus: {
        diplomiKoodiUrit: ['lukiodiplomit_1#1'],
        diplomiKuvaus: {
          fi: 'Fi diplomi',
          sv: 'Sv diplomi',
        },
      },
      kielivalikoima: {
        A1Kielet: ['kieli_en#1'],
        A2Kielet: ['kieli_sv#1'],
        B2Kielet: ['kieli_en#1'],
        B1Kielet: ['kieli_en#1'],
        B3Kielet: ['kieli_sv#1'],
        aidinkielet: ['kieli_de#1'],
        muutKielet: ['kieli_de#1'],
      },
      jaksonKuvaus: {
        fi: 'Fi jakso',
        sv: 'Sv jakso',
      },
    },
    _enrichedData: {
      esitysnimi: {
        fi: 'Lukio, 150 opintopistettä',
        sv: 'Gymnasium, 150 studiepoäng',
      },
    },
  });

export default ({ tyyppi = 'amm' }) => {
  if (tyyppi === 'amm-muu') {
    return getBaseFields({ tyyppi });
  }
  if (tyyppi.startsWith('amm')) {
    return getAmmatillinenFields({ tyyppi });
  } else if (tyyppi === 'lk') {
    return getLukioFields({ tyyppi });
  }

  return getBaseFields({ tyyppi });
};
