import _ from 'lodash';

const withKorkeakouluFields = valintaperuste =>
  _.merge(
    {
      metadata: {
        valintatavat: [
          {
            valintatapaKoodiUri: 'valintatapajono_tv#1',
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
            enimmaispisteet: 100.02,
            vahimmaispisteet: 10.01,
          },
        ],
      },
    },
    valintaperuste
  );

const valintaperuste = ({ tyyppi = 'amm' } = {}) => {
  const baseFields = {
    koulutustyyppi: tyyppi,
    id: '649adb37-cd4d-4846-91a9-84b58b90f928',
    tila: 'tallennettu',
    hakutapaKoodiUri: 'hakutapa_01#1',
    kohdejoukkoKoodiUri: 'haunkohdejoukko_12#1',
    nimi: { fi: 'Valintaperusteen nimi' },
    julkinen: false,
    sorakuvausId: '1',
    metadata: {
      koulutustyyppi: tyyppi,
      kuvaus: { fi: '<p>Loppukuvaus</p>' },
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
      valintakokeidenYleiskuvaus: {
        fi: '<p>Valintakokeiden kuvaus - fi</p>',
      },
    },
    organisaatioOid: '1.2.246.562.10.594252633210',
    muokkaaja: '1.2.246.562.24.62301161440',
    kielivalinta: ['fi', 'sv'],
    modified: '2019-04-03T13:56',

    valintakokeet: [
      {
        id: 'testi-id-123',
        nimi: {
          fi: 'Kokeen nimi - fi',
        },
        metadata: {
          tietoja: {
            fi: '<p>Tietoa kokeesta - fi</p>',
          },
          liittyyEnnakkovalmistautumista: true,
          ohjeetEnnakkovalmistautumiseen: {
            fi: '<p>Ohjeet ennakkovalmistautumiseen - fi</p>',
          },
          erityisjarjestelytMahdollisia: true,
          ohjeetErityisjarjestelyihin: {
            fi: '<p>Ohjeet erityisjärjestelyihin - fi</p>',
          },
          vahimmaispisteet: 10.03,
        },
        tyyppiKoodiUri: 'tyyppi_1#1',
        tilaisuudet: [
          {
            osoite: {
              osoite: { fi: 'fi osoite' },
              postinumeroKoodiUri: 'posti_00350#2',
            },
            aika: {
              alkaa: '2019-04-16T08:44',
              paattyy: '2019-04-18T08:44',
            },
            lisatietoja: {
              fi: 'fi lisatietoja',
            },
            jarjestamispaikka: {
              fi: 'Jarjestamispaikka - fi',
            },
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

export default valintaperuste;
