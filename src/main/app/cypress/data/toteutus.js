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
      opetuskieliKoodiUrit: ['oppilaitoksenopetuskieli_1#1'],
      opetuskieletKuvaus: {
        fi: 'Opetuskieli kuvaus',
      },
      opetusaikaKoodiUri: 'opetusaikakk_1#1',
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
      maksunMaara: { fi: '20' },
      alkamiskausiKoodiUri: 'kausi_1#1',
      alkamisvuosi: '2024',
      alkamisaikaKuvaus: {
        fi: 'Alkamisaika kuvaus',
      },
      lisatiedot: [
        {
          otsikkoKoodiUri: 'koulutuksenjarjestamisenlisaosiot_0#1',
          teksti: {
            fi: 'koulutuksenjarjestamisenlisaosiot_0 kuvaus',
          },
        },
      ],
    },
    asiasanat: [
      { kieli: 'fi', arvo: 'koira' },
      { kieli: 'fi', arvo: 'eläintenhoito' },
    ],
    ammattinimikkeet: [{ kieli: 'fi', arvo: 'eläintenhoitaja' }],
    yhteystieto: {
      nimi: { fi: 'Sami Raunio' },
      titteli: { fi: 'hakuhemmo' },
      sahkoposti: { fi: 'hakutoimisto@salpaus.fi' },
      puhelinnumero: { fi: '123456' },
      wwwSivu: { fi: 'www.salpaus.fi' },
    },
  },
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
      opetus: {
        onkoLukuvuosimaksua: true,
        lukuvuosimaksu: {
          fi: '30',
        },
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
      },
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

export default ({ tyyppi = 'amm' }) => {
  if (tyyppi === 'amm') {
    return getAmmatillinenFields({ tyyppi });
  } else if (['yo', 'amk'].includes(tyyppi)) {
    return getKorkeakouluFields({ tyyppi });
  }

  return getBaseFields();
};
