import { Alkamiskausityyppi } from '#/src/constants';

export default () => ({
  oid: '1.2.246.562.29.00000000000000000001',
  tila: 'tallennettu',
  nimi: { fi: 'Haku' },
  hakutapaKoodiUri: 'hakutapa_0#1',
  hakukohteenLiittamisenTakaraja: '2019-02-08T07:05',
  hakukohteenMuokkaamisenTakaraja: '2019-02-08T07:05',

  kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
  kohdejoukonTarkenneKoodiUri: 'haunkohdejoukontarkenne_0#1',
  hakulomaketyyppi: 'ataru',
  hakulomakeAtaruId: '12345',
  hakulomakeKuvaus: {},
  hakulomakeLinkki: {},
  metadata: {
    koulutuksenAlkamiskausi: {
      alkamiskausityyppi: Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI,
      koulutuksenAlkamiskausiKoodiUri: 'kausi_0#1',
      koulutuksenAlkamisvuosi: '2024',
    },
    tulevaisuudenAikataulu: [
      { alkaa: '2019-10-11T09:05', paattyy: '2019-12-25T20:30' },
    ],
    yhteyshenkilot: [
      {
        nimi: {
          fi: 'nimi',
        },
        titteli: {
          fi: 'titteli',
        },
        puhelinnumero: {
          fi: 'puhelin',
        },
        wwwSivu: {
          fi: 'verkkosivu',
        },
        sahkoposti: {
          fi: 'sähkoposti',
        },
      },
    ],
  },
  organisaatioOid: '1.2.246.562.10.594252633210',
  hakuajat: [{ alkaa: '2019-02-08T07:05', paattyy: '2020-02-08T07:05' }],
  ajastettuJulkaisu: '2019-12-05T06:45',
  muokkaaja: '1.2.246.562.24.62301161440',
  kielivalinta: ['fi', 'sv'],
  modified: '2019-03-29T12:48',
});
