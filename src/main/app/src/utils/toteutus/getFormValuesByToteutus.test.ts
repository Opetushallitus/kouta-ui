import {
  Alkamiskausityyppi,
  ApurahaYksikko,
  JULKAISUTILA,
} from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';
import getFormValuesByToteutus, {
  hakukohteetKaytossaToFormValues,
} from '#/src/utils/toteutus/getFormValuesByToteutus';

test('getFormValuesByToteutus returns correct form values given toteutus', () => {
  const values = getFormValuesByToteutus({
    externalId: 'ext1',
    tila: JULKAISUTILA.TALLENNETTU,
    kielivalinta: ['fi', 'sv'],
    metadata: {
      ammattinimikkeet: [
        {
          arvo: 'nimike1',
          kieli: 'fi',
        },
        {
          arvo: 'nimike2',
          kieli: 'sv',
        },
      ],
      asiasanat: [
        {
          arvo: 'avainsana1',
          kieli: 'fi',
        },
        {
          arvo: 'avainsana2',
          kieli: 'sv',
        },
      ],
      kuvaus: {
        fi: 'Fi toteutuksenkuvaus',
        sv: 'Sv toteutuksenkuvaus',
      },
      osaamistavoitteet: {
        fi: 'Fi osaamistavoitteet',
        sv: 'Sv osaamistavoitteet',
      },
      ammatillinenPerustutkintoErityisopetuksena: true,
      yleislinja: true,
      painotukset: [
        {
          koodiUri: 'painotus_1#1',
          kuvaus: { fi: 'painotus 1 fi', sv: 'painotus 1 sv' },
        },
      ],
      erityisetKoulutustehtavat: [
        {
          koodiUri: 'erityinenkoulutustehtava_1#1',
          kuvaus: {
            fi: 'erityinen koulutustehtävä 1 fi',
            sv: 'erityinen koulutustehtävä 1 sv',
          },
        },
      ],
      opetus: {
        koulutuksenAlkamiskausi: {
          alkamiskausityyppi: Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA,
          koulutuksenAlkamiskausiKoodiUri: 'kausi_k#1',
          koulutuksenAlkamispaivamaara: '2021-04-16T00:00',
          koulutuksenPaattymispaivamaara: '2021-12-12T00:00',
          koulutuksenAlkamisvuosi: 2020,
        },
        lisatiedot: [
          {
            otsikkoKoodiUri: 'osio_1#1',
            teksti: {
              fi: 'Fi kuvaus1',
              sv: 'Sv kuvaus1',
            },
          },
          {
            otsikkoKoodiUri: 'osio_2#1',
            teksti: {
              fi: 'Fi kuvaus2',
              sv: 'Sv kuvaus2',
            },
          },
        ],
        maksullisuustyyppi: MaksullisuusTyyppi.MAKSULLINEN,
        maksunMaara: 500.0,
        maksullisuusKuvaus: {
          fi: 'Fi maksullisuuskuvaus',
          sv: 'Sv maksullisuuskuvaus',
        },
        suunniteltuKestoKuvaus: {
          fi: 'Fi suunniteltuKestoKuvaus',
          sv: 'Sv suunniteltuKestoKuvaus',
        },
        suunniteltuKestoVuodet: 2,
        suunniteltuKestoKuukaudet: 6,
        opetusaikaKoodiUrit: ['opetusaika_1#1'],
        opetusaikaKuvaus: {
          fi: 'Fi aikakuvaus',
          sv: 'Sv aikakuvaus',
        },
        opetuskieletKuvaus: {
          fi: 'Fi kielikuvaus',
          sv: 'Sv kielikuvaus',
        },
        opetuskieliKoodiUrit: ['opetuskieli_1#1', 'opetuskieli_2#1'],
        opetustapaKoodiUrit: ['opetustapa_1#1', 'opetustapa_2#1'],
        opetustapaKuvaus: {
          fi: 'Fi tapakuvaus',
          sv: 'Sv tapakuvaus',
        },
        onkoApuraha: true,
        apuraha: {
          min: 100,
          max: 200,
          kuvaus: {
            fi: 'Fi apurahakuvaus',
            sv: 'Sv apurahakuvaus',
          },
          yksikko: ApurahaYksikko.EURO,
        },
      },
      kielivalikoima: {
        A1Kielet: ['kieli_1#1'],
        A2Kielet: ['kieli_2#1'],
        B1Kielet: ['kieli_3#1'],
        B2Kielet: ['kieli_4#1'],
        B3Kielet: ['kieli_5#1'],
        aidinkielet: ['kieli_6#1'],
        muutKielet: ['kieli_7#1'],
      },
      diplomit: [
        {
          koodiUri: 'moduulikoodistolops2021_kald3#1',
          linkki: { fi: 'http://linkki.fi', sv: 'http://link.se' },
          linkinAltTeksti: { fi: 'Suomeksi', sv: 'På svenska' },
        },
      ],
      osaamisalat: [
        {
          koodiUri: 'osaamisala1',
          linkki: {
            fi: 'Fi linkki1',
            sv: 'Sv linkki1',
          },
          otsikko: {
            fi: 'Fi otsikko1',
            sv: 'Sv otsikko1',
          },
        },
        {
          koodiUri: 'osaamisala2',
          linkki: {
            fi: 'Fi linkki2',
            sv: 'Sv linkki2',
          },
          otsikko: {
            fi: 'Fi otsikko2',
            sv: 'Sv otsikko2',
          },
        },
      ],
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
      tutkinnonOsat: [
        {
          osaamisalaKoodiUri: 'osaamisala_1#1',
          tutkinnonOsaKoodiUrit: ['tutkinnonosa_1#1'],
          tutkintoKoodiUri: 'tutkinto_1#1',
        },
      ],
      opintojenLaajuusNumero: 25,
      opintojenLaajuusNumeroMin: 30,
      opintojenLaajuusNumeroMax: 35,
      opintojenLaajuusyksikkoKoodiUri: 'laajuus_1#1',
      ilmoittautumislinkki: {
        fi: 'Fi linkki',
        sv: 'Sv linkki',
      },
      aloituspaikat: 251,
      aloituspaikkakuvaus: {
        fi: '<p>Aloituspaikan kuvaus - fi</p>',
        sv: '<p>Aloituspaikan kuvaus - sv</p>',
      },
      suunniteltuKesto: {
        fi: 'Fi kesto',
        sv: 'Sv kesto',
      },
      toteutusjaksot: [
        {
          ilmoittautumislinkki: {
            fi: 'Fi linkki',
            sv: 'Sv linkki',
          },
          koodi: 'koodi 123',
          kuvaus: {
            fi: 'Fi kuvaus',
            sv: 'Sv kuvaus',
          },
          laajuus: {
            fi: 'Fi laajuus',
            sv: 'Sv laajuus',
          },
          nimi: {
            fi: 'Fi nimi',
            sv: 'Sv nimi',
          },
          sisalto: [
            {
              data: {
                fi: '<h2>Fi sisalto</h2>',
                sv: '<h2>Sv sisalto</h2>',
              },
              tyyppi: 'teksti',
            },
            {
              data: {
                rows: [
                  {
                    columns: [
                      {
                        index: 0,
                        text: {
                          fi: 'Fi column1',
                          sv: 'Sv column1',
                        },
                      },
                      {
                        index: 1,
                        text: {
                          fi: 'Fi column2',
                          sv: 'Sv column2',
                        },
                      },
                    ],
                    index: 0,
                  },
                  {
                    columns: [
                      {
                        index: 0,
                        text: {
                          fi: 'Fi column3',
                          sv: 'Sv column3',
                        },
                      },
                      {
                        index: 1,
                        text: {
                          fi: 'Fi column4',
                          sv: 'Sv column4',
                        },
                      },
                    ],
                    index: 1,
                  },
                ],
              },
              tyyppi: 'taulukko',
            },
          ],
        },
      ],
      taiteenalaKoodiUrit: [
        'taiteenperusopetustaiteenala_sirkustaide',
        'taiteenperusopetustaiteenala_sanataide',
      ],
    },
    nimi: {
      fi: 'Fi nimi',
      sv: 'Sv nimi',
    },
    tarjoajat: ['org1', 'org2'],
  });

  expect(values).toMatchSnapshot();
});

test('hakukohteetKaytossaToFormValues mapping checks hakulomaketyyppi if isHakukohteetKaytossa is missing', () => {
  expect(hakukohteetKaytossaToFormValues({})).toBe(undefined);
  expect(hakukohteetKaytossaToFormValues({ isHakukohteetKaytossa: true })).toBe(
    true
  );
  expect(
    hakukohteetKaytossaToFormValues({ isHakukohteetKaytossa: false })
  ).toBe(false);
  expect(
    hakukohteetKaytossaToFormValues({ isHakukohteetKaytossa: undefined })
  ).toBe(undefined);
  expect(
    hakukohteetKaytossaToFormValues({
      isHakukohteetKaytossa: undefined,
      hakulomaketyyppi: 'ataru',
    })
  ).toBe(true);
  expect(
    hakukohteetKaytossaToFormValues({
      hakulomaketyyppi: 'ataru',
    })
  ).toBe(true);
  expect(
    hakukohteetKaytossaToFormValues({
      isHakukohteetKaytossa: undefined,
      hakulomaketyyppi: 'muu',
    })
  ).toBe(false);
  expect(
    hakukohteetKaytossaToFormValues({
      isHakukohteetKaytossa: undefined,
      hakulomaketyyppi: 'ei sähköistä',
    })
  ).toBe(false);
  expect(
    hakukohteetKaytossaToFormValues({
      isHakukohteetKaytossa: undefined,
      hakulomaketyyppi: undefined,
    })
  ).toBe(undefined);
});
