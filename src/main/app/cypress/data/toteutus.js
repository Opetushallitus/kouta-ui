import merge from 'lodash/merge';

const getBaseFields = () => ({
  oid: '1.2.246.562.17.00000000000000000026',
  koulutusOid: '1.2.246.562.13.00000000000000000041',
  tila: 'tallennettu',
  tarjoajat: ['1.2.246.562.10.74534804344'],
  nimi: { fi: 'Koulutuskeskus Salpaus, jatkuva haku, eläintenhoitaja' },
  metadata: {
    kuvaus: {
      fi: 'Toteutuksen kuvaus',
    },
    opetus: {
      koulutuksenAlkamispaivamaara: '2019-08-23T00:00',
      koulutuksenPaattymispaivamaara: '2019-08-26T00:00',
      opetuskieliKoodiUrit: ['oppilaitoksenopetuskieli_1#1'],
      opetuskieletKuvaus: {
        fi: 'Opetuskieli kuvaus',
      },
      opetusaikaKoodiUrit: ['opetusaikakk_1#1'],
      opetusaikaKuvaus: {
        fi: 'Opetusaika kuvaus',
      },
      opetustapaKoodiUrit: ['opetuspaikkakk_1#1'],
      opetustapaKuvaus: {
        fi: 'Opetustapa kuvaus',
      },
      onkoMaksullinen: true,
      maksullisuusKuvaus: {
        fi: 'Maksullisuus kuvaus',
      },
      maksunMaara: 20,
      alkamiskausiKoodiUri: 'kausi_1#1',
      alkamisvuosi: '2024',
      alkamisaikaKuvaus: {
        fi: 'Alkamisaika kuvaus',
      },
      onkoLukuvuosimaksua: true,
      lukuvuosimaksu: 30,
      lukuvuosimaksuKuvaus: {
        fi: 'Lukuvuosimaksu kuvaus',
      },
      onkoStipendia: true,
      stipendinMaara: {
        fi: '90',
      },
      stipendinKuvaus: {
        fi: 'Stipendin kuvaus',
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
          fi: 'Fi verkkosivu',
          sv: 'Sv verkkosivu',
        },
      },
    ],
  },
  lukionLinjanTarkenneKoodiUrit: ['lukiolinjat2_1#1'],
  erityinenKoulutustehtavaKoodiUrit: ['lukionerityistehtava_1#1'],
  muokkaaja: '1.2.246.562.24.62301161440',
  organisaatioOid: '1.2.246.562.10.594252633210',
  kielivalinta: ['fi', 'sv'],
  modified: '2019-03-26T10:19',
});

const getAmmatillinenFields = ({ tyyppi }) =>
  merge(getBaseFields(), {
    metadata: {
      tyyppi,
      osaamisalat: [
        {
          koodi: 'osaamisala_0',
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

const getKorkeakouluFields = ({ tyyppi }) =>
  merge(getBaseFields(), {
    metadata: {
      tyyppi,
      ylemmanKorkeakoulututkinnonOsaamisalat: [
        {
          kuvaus: { fi: 'osaamisalan kuvaus' },
          nimi: { fi: 'osaamisalan nimi' },
          linkki: { fi: 'linkki' },
          otsikko: { fi: 'osaamisalan otsikko' },
        },
      ],
      alemmanKorkeakoulututkinnonOsaamisalat: [
        {
          kuvaus: { fi: 'osaamisalan kuvaus' },
          nimi: { fi: 'osaamisalan nimi' },
          linkki: { fi: 'linkki' },
          otsikko: { fi: 'osaamisalan otsikko' },
        },
      ],
    },
  });

const getLukioFields = ({ tyyppi }) =>
  merge(getBaseFields(), {
    metadata: {
      tyyppi,
      opetus: {
        diplomiKoodiUrit: ['lukiodiplomit_1#1'],
        diplomiKuvaus: {
          fi: 'Fi diplomi',
          sv: 'Sv diplomi',
        },
        A1JaA2Kielivalikoima: ['kieli_1#1'],
        B2Kielivalikoima: ['kieli_2#1'],
        B1Kielivalikoima: ['kieli_3#1'],
        B3Kielivalikoima: ['kieli_4#1'],
        aidinkieliKielivalikoima: ['kieli_4#1'],
        muuKielivalikoima: ['kieli_4#1'],
      },
      lukiolinjaKoodiUri: 'lukiolinjat_0#1',
      jaksonKuvaus: {
        fi: 'Fi jakso',
        sv: 'Sv jakso',
      },
    },
  });

export default ({ tyyppi = 'amm' }) => {
  if (tyyppi === 'amm') {
    return getAmmatillinenFields({ tyyppi });
  } else if (['yo', 'amk'].includes(tyyppi)) {
    return getKorkeakouluFields({ tyyppi });
  } else if (tyyppi === 'lk') {
    return getLukioFields({ tyyppi });
  }

  return getBaseFields();
};
