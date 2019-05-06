import merge from 'lodash/merge';

import { getByTestId, chooseKieliversiotLanguages } from '../../utils';
import koulutus from '../../data/koulutus';
import { stubKoulutusFormRoutes } from '../../koulutusFormUtils';

const fillKieliversiotSection = cy => {
  getByTestId('kieliversiotSection', cy).within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
  });
};

const tallenna = cy => {
  getByTestId('tallennaKoulutusButton', cy).click();
};

describe('editKoulutusForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const koulutusOid = '1.2.3.4.5.6';

  const testKoulutusFields = {
    oid: koulutusOid,
    organisaatioOid: organisaatioOid,
    koulutusKoodiUri: 'koulutus_0#1',
    tarjoajat: ['4.1.1.1.1.1', '2.1.1.1.1.1'],
  };

  beforeEach(() => {
    cy.server();

    stubKoulutusFormRoutes({ cy, organisaatioOid });

    cy.route({
      method: 'GET',
      url: `**/koulutus/${koulutusOid}/toteutukset`,
      response: [],
    });

    cy.route({
      method: 'GET',
      url: `**/toteutus/list**`,
      response: [],
    });

    cy.visit(`/koulutus/${koulutusOid}/muokkaus`);
  });

  it('should be able to edit ammatillinen koulutus', () => {
    cy.route({
      method: 'POST',
      url: '**/koulutus',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('updateAmmKoulutusResponse');

    const testKoulutus = merge(koulutus({ tyyppi: 'amm' }), testKoulutusFields);

    cy.route({
      method: 'GET',
      url: `**/koulutus/${koulutusOid}`,
      response: testKoulutus,
    });

    fillKieliversiotSection(cy);
    tallenna(cy);

    cy.wait('@updateAmmKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });

  it('should be able to edit korkeakoulu koulutus', () => {
    cy.route({
      method: 'POST',
      url: '**/koulutus',
      response: {
        muokattu: false,
      },
    }).as('updateYoKoulutusResponse');

    cy.route({
      method: 'GET',
      url: `**/koulutus/${koulutusOid}`,
      response: merge(koulutus({ tyyppi: 'yo' }), testKoulutusFields),
    });

    fillKieliversiotSection(cy);
    tallenna(cy);

    cy.wait('@updateYoKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
