import merge from 'lodash/merge';

import { getByTestId, stubKoodistoRoute } from '../../utils';

import organisaatio from '../../data/organisaatio';
import valintaperuste from '../../data/valintaperuste';

const tallenna = cy => {
  getByTestId('tallennaValintaperusteButton', cy).click({ force: true });
};

describe('editValintaperusteForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const valintaperusteId = '1';

  const testValintaperusteFields = {
    organisaatioOid,
  };

  beforeEach(() => {
    cy.server();

    cy.route({
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/${organisaatioOid}**`,
      response: merge(organisaatio(), {
        oid: organisaatioOid,
      }),
    });

    stubKoodistoRoute({ koodisto: 'hakutapa', cy });
    stubKoodistoRoute({ koodisto: 'haunkohdejoukko', cy });
    stubKoodistoRoute({ koodisto: 'valintatapajono', cy });
    stubKoodistoRoute({ koodisto: 'kielitaidonosoittaminen', cy });
    stubKoodistoRoute({ koodisto: 'kielitaitovaatimustyypit', cy });
    stubKoodistoRoute({ koodisto: 'kielitaitovaatimustyypitkuvaus', cy });
    stubKoodistoRoute({ koodisto: 'kieli', cy });

    cy.visit(`/valintaperusteet/${valintaperusteId}/muokkaus`);
  });

  it('should be able to edit valintaperuste', () => {
    cy.route({
      method: 'POST',
      url: '**/valintaperuste',
      response: {
        muokattu: false,
      },
    }).as('updateValintaperusteRequest');

    cy.route({
      method: 'GET',
      url: `**/valintaperuste/${valintaperusteId}`,
      response: merge(
        valintaperuste({ tyyppi: 'amm' }),
        testValintaperusteFields,
      ),
    });

    tallenna(cy);

    cy.wait('@updateValintaperusteRequest').then(({ request }) => {
      expect(request.body).to.deep.equal({
        koulutustyyppi: 'amm',
        id: '649adb37-cd4d-4846-91a9-84b58b90f928',
        tila: 'tallennettu',
        hakutapaKoodiUri: 'hakutapa_0#1',
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        nimi: { fi: 'Valintaperusteen nimi' },
        onkoJulkinen: false,
        metadata: {
          koulutustyyppi: 'amm',
          valintatavat: [
            {
              kuvaus: {},
              nimi: {},
              valintatapaKoodiUri: 'valintatapajono_0#1',
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
              enimmaispisteet: 100,
              vahimmaispisteet: 10,
            },
          ],
          kielitaitovaatimukset: [
            {
              kieliKoodiUri: 'kieli_0#1',
              vaatimukset: [
                {
                  kielitaitovaatimusKoodiUri: 'kielitaitovaatimustyypit_0#1',
                  kielitaitovaatimusKuvaukset: [
                    {
                      kielitaitovaatimusTaso: 'hyvä',
                      kielitaitovaatimusKuvausKoodiUri:
                        'kielitaitovaatimustyypitkuvaus_0#1',
                    },
                  ],
                },
              ],
              kielitaidonVoiOsoittaa: [
                {
                  kielitaitoKoodiUri: 'kielitaidonosoittaminen_0#1',
                  lisatieto: {},
                },
              ],
            },
          ],
          osaamistaustaKoodiUrit: [],
          kuvaus: {},
        },
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        kielivalinta: ['fi', 'sv'],
        modified: '2019-04-03T13:56',
      });
    });
  });
});
