import merge from 'lodash/merge';

import { getByTestId, stubKoodistoRoute } from '../../utils';

import organisaatio from '../../data/organisaatio';
import koulutus from '../../data/koulutus';
import haku from '../../data/haku';
import toteutus from '../../data/toteutus';
import valintaperuste from '../../data/valintaperuste';
import hakukohde from '../../data/hakukohde';

const tallenna = cy => {
  getByTestId('tallennaHakukohdeButton', cy).click({ force: true });
};

describe('createHakukohdeForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const toteutusOid = '2.1.1.1.1.1';
  const koulutusOid = '3.1.1.1.1';
  const hakuOid = '4.1.1.1.1.1';
  const valintaperusteOid = '5.1.1.1.1.1';
  const hakukohdeOid = '6.1.1.1.1.1';

  const testHakukohdeFields = {
    toteutusOid,
    hakuOid,
    organisaatioOid,
    oid: hakukohdeOid,
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

    stubKoodistoRoute({ koodisto: 'pohjakoulutusvaatimustoinenaste', cy });
    stubKoodistoRoute({ koodisto: 'kausi', cy });
    stubKoodistoRoute({ koodisto: 'valintakokeentyyppi', cy });
    stubKoodistoRoute({ koodisto: 'liitetyypitamm', cy });

    cy.route({
      method: 'GET',
      url: '**/valintaperuste/list**',
      response: [
        merge(valintaperuste(), {
          oid: valintaperusteOid,
          nimi: { fi: 'Valintaperusteen nimi' },
        }),
      ],
    });

    cy.route({
      method: 'GET',
      url: `**/haku/${hakuOid}`,
      response: merge(haku(), {
        oid: hakuOid,
        organisaatioOid: organisaatioOid,
      }),
    });

    cy.route({
      method: 'GET',
      url: `**/toteutus/${toteutusOid}`,
      response: merge(toteutus({ tyyppi: 'amm' }), {
        oid: toteutusOid,
        organisaatioOid: organisaatioOid,
        koulutusOid: koulutusOid,
      }),
    });

    cy.route({
      method: 'GET',
      url: `**/koulutus/${koulutusOid}`,
      response: merge(koulutus({ tyyppi: 'amm' }), {
        oid: koulutusOid,
        organisaatioOid: organisaatioOid,
      }),
    });

    cy.visit(`/hakukohde/${hakukohdeOid}/muokkaus`);
  });

  it('should be able to edit hakukohde', () => {
    cy.route({
      method: 'GET',
      url: `**/hakukohde/${hakukohdeOid}`,
      response: merge(hakukohde(), testHakukohdeFields),
    });

    cy.route({
      method: 'POST',
      url: '**/hakukohde',
      response: {
        muokattu: false,
      },
    }).as('updateHakukohdeRequest');

    tallenna(cy);

    cy.wait('@updateHakukohdeRequest').then(({ request }) => {
      cy.log(JSON.stringify(request.body));
    });
  });
});
