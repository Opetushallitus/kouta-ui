import merge from 'lodash/merge';

import { getByTestId } from '../../utils';
import { stubHakuFormRoutes } from '../../hakuFormUtils';

import haku from '../../data/haku';

const tallenna = cy => {
  getByTestId('tallennaHakuButton', cy).click();
};

describe('editHakuForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const hakuOid = '2.1.1.1.1.1';

  beforeEach(() => {
    cy.server();

    stubHakuFormRoutes({ organisaatioOid, cy });

    cy.route({
      method: 'GET',
      url: `**/haku/${hakuOid}/hakukohteet/list**`,
      response: [],
    });

    cy.route({
      method: 'GET',
      url: `**/toteutus/list**`,
      response: [],
    });

    cy.visit(`/haku/${hakuOid}/muokkaus`);
  });

  it('should be able to edit haku', () => {
    cy.route({
      method: 'GET',
      url: `**/haku/${hakuOid}`,
      response: merge(haku(), {
        oid: hakuOid,
        organisaatioOid: organisaatioOid,
      }),
    });

    cy.route({
      method: 'POST',
      url: '**/haku',
      response: {
        muokattu: false,
      },
    }).as('editHakuRequest');

    tallenna(cy);

    cy.wait('@editHakuRequest').then(({ request }) => {
      expect(request.body).to.deep.equal({
        oid: '2.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        tila: 'tallennettu',
        organisaatioOid: '1.1.1.1.1.1',
        alkamiskausiKoodiUri: 'kausi_0#1',
        kielivalinta: ['fi', 'sv'],
        hakutapaKoodiUri: 'hakutapa_0#1',
        hakuajat: [{ alkaa: '2019-02-08T07:05', paattyy: '2020-02-08T07:05' }],
        hakukohteenLiittamisenTakaraja: '2019-02-08T07:05',
        nimi: { fi: 'Haku' },
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        kohdejoukonTarkenneKoodiUri: null,
        hakulomaketyyppi: 'ataru',
        metadata: {
          tulevaisuudenAikataulu: [
            { alkaa: '2019-10-11T09:05', paattyy: '2019-12-25T20:30' },
          ],
          yhteystieto: {
            nimi: { fi: 'nimi' },
            titteli: { fi: 'titteli' },
            sahkoposti: { fi: 'sähkoposti' },
            puhelinnumero: { fi: 'puhelin' },
          },
        },
        hakukohteenMuokkaamisenTakaraja: '2019-02-08T07:05',
        ajastettuJulkaisu: '2019-12-05T06:45',
        alkamisvuosi: 2024,
        hakulomake: null,
      });
    });
  });
});
