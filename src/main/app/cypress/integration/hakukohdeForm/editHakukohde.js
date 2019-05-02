import merge from 'lodash/merge';

import { getByTestId, chooseKieliversiotLanguages } from '../../utils';

import koulutus from '../../data/koulutus';
import toteutus from '../../data/toteutus';
import valintaperuste from '../../data/valintaperuste';
import hakukohde from '../../data/hakukohde';
import { stubHakukohdeFormRoutes } from '../../hakukohdeFormUtils';

const fillKieliversiotSection = cy => {
  getByTestId('kieliversiotSection', cy).within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
  });
};

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

    stubHakukohdeFormRoutes({ cy, organisaatioOid, hakuOid });

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

    fillKieliversiotSection(cy);
    tallenna(cy);

    cy.wait('@updateHakukohdeRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
