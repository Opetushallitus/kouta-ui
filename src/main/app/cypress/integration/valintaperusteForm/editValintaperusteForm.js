import merge from 'lodash/merge';

import { getByTestId } from '../../utils';
import valintaperuste from '../../data/valintaperuste';
import { stubValintaperusteFormRoutes } from '../../valintaperusteFormUtils';

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
    stubValintaperusteFormRoutes({ cy, organisaatioOid });

    cy.visit(`/valintaperusteet/${valintaperusteId}/muokkaus`);
  });

  it('should be able to edit ammatillinen valintaperuste', () => {
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
              nimi: { fi: 'Valintatavan nimi' },
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
          valituksiTulemisenVahimmaisehto: {
            fi: 'Ehto',
          },
        },
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        kielivalinta: ['fi', 'sv'],
        modified: '2019-04-03T13:56',
      });
    });
  });

  it('should be able to edit korkeakoulu valintaperuste', () => {
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
        valintaperuste({ tyyppi: 'yo' }),
        testValintaperusteFields,
      ),
    });

    tallenna(cy);

    cy.wait('@updateValintaperusteRequest').then(({ request }) => {
      expect(request.body).to.deep.equal({
        koulutustyyppi: 'yo',
        id: '649adb37-cd4d-4846-91a9-84b58b90f928',
        tila: 'tallennettu',
        hakutapaKoodiUri: 'hakutapa_0#1',
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        nimi: { fi: 'Valintaperusteen nimi' },
        onkoJulkinen: false,
        metadata: {
          koulutustyyppi: 'yo',
          valintatavat: [
            {
              kuvaus: {},
              nimi: { fi: 'Valintatavan nimi' },
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
          osaamistaustaKoodiUrit: ['osaamistausta_0#1'],
          kuvaus: { fi: '<p>Loppukuvaus</p>' },
          valituksiTulemisenVahimmaisehto: {
            fi: 'Ehto',
          },
        },
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        kielivalinta: ['fi', 'sv'],
        modified: '2019-04-03T13:56',
      });
    });
  });
});
