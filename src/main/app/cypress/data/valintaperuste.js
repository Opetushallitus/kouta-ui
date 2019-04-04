export default ({ tyyppi = 'amm' } = {}) => ({
  koulutustyyppi: tyyppi,
  id: '649adb37-cd4d-4846-91a9-84b58b90f928',
  tila: 'tallennettu',
  hakutapaKoodiUri: 'hakutapa_0#1',
  kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
  nimi: { fi: 'Valintaperusteen nimi' },
  onkoJulkinen: false,
  metadata: {
    koulutustyyppi: tyyppi,
    valintatavat: [
      {
        valintatapaKoodiUri: 'valintatapajono_0#1',
        kuvaus: {},
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
    kielitaitovaatimukset: [
      {
        kieliKoodiUri: 'kieli_0#1',
        kielitaidonVoiOsoittaa: [
          {
            kielitaitoKoodiUri: 'kielitaidonosoittaminen_0#1',
            lisatieto: { fi: 'Kuvaus' },
          },
        ],
        vaatimukset: [
          {
            kielitaitovaatimusKoodiUri: 'kielitaitovaatimustyypit_0#1',
            kielitaitovaatimusKuvaukset: [
              {
                kielitaitovaatimusKuvausKoodiUri:
                  'kielitaitovaatimustyypitkuvaus_0#1',
                kielitaitovaatimusTaso: 'hyvä',
              },
            ],
          },
        ],
      },
    ],
  },
  organisaatioOid: '1.2.246.562.10.594252633210',
  muokkaaja: '1.2.246.562.24.62301161440',
  kielivalinta: ['fi', 'sv'],
  modified: '2019-04-03T13:56',
});
