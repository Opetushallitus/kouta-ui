import { merge } from 'lodash';

const withKorkeakouluFields = valintaperuste => merge({}, valintaperuste, {});

export default ({ tyyppi = 'amm' } = {}) => {
  const baseFields = {
    koulutustyyppi: tyyppi,
    id: '649adb37-cd4d-4846-91a9-84b58b90f928',
    tila: 'tallennettu',
    hakutapaKoodiUri: 'hakutapa_0#1',
    kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
    nimi: { fi: 'Valintaperusteen nimi' },
    julkinen: false,
    sorakuvausId: '1',
    metadata: {
      koulutustyyppi: tyyppi,
      valintatavat: [
        {
          valintatapaKoodiUri: 'valintatapajono_0#1',
          kuvaus: {},
          nimi: { fi: 'Valintatavan nimi' },
          sisalto: [
            { tyyppi: 'teksti', data: { fi: '<p>Tekstia</p>' } },
            {
              tyyppi: 'taulukko',
              data: {
                nimi: {},
                rows: [
                  {
                    index: 0,
                    isHeader: false,
                    columns: [{ index: 0, text: { fi: 'Solu' } }],
                  },
                ],
              },
            },
          ],
          kaytaMuuntotaulukkoa: false,
          kynnysehto: { fi: 'Kynnysehto' },
          enimmaispisteet: 100.0,
          vahimmaispisteet: 10.0,
        },
      ],
      kielitaitovaatimukset: [],
      kuvaus: { fi: '<p>Loppukuvaus</p>' },
    },
    organisaatioOid: '1.2.246.562.10.594252633210',
    muokkaaja: '1.2.246.562.24.62301161440',
    kielivalinta: ['fi', 'sv'],
    modified: '2019-04-03T13:56',
    valintakokeidenYleiskuvaus: 'Valintakokeiden kuvaus',
    valintakokeet: [
      {
        nimi: 'Kokeen nimi',
        tietoa: 'Tietoa kokeesta',
        liittyyEnnakkovalmistautumista: true,
        ohjeetEnnakkovalmistautumiseen:
          '<p>Ohjeet ennakkovalmistautumiseen</p>',
        erityisjarjestelytMahdollisia: true,
        ohjeetErityisjarjestelyihin: '<p>Ohjeet erityisjärjestelyihin</p>',
        tyyppiKoodiUri: 'tyyppi_1#1',
        tilaisuudet: [
          {
            osoite: {
              osoite: { fi: 'fi osoite', sv: 'sv osoite' },
              postinumeroKoodiUri: 'posti_00350#1',
            },
            aika: {
              alkaa: '2019-04-16T08:44',
              paattyy: '2019-04-18T08:44',
            },
            lisatietoja: {
              fi: 'fi lisatietoja',
              sv: 'sv lisatietoja',
            },
            jarjestamispaikka: 'Auditorio A1',
          },
        ],
      },
    ],
  };

  if (tyyppi === 'amm') {
    return baseFields;
  } else if (['yo', 'amk'].includes(tyyppi)) {
    return withKorkeakouluFields(baseFields);
  }

  return baseFields;
};
