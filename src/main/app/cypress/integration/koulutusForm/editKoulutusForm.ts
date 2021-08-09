import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import { merge } from 'lodash/fp';

import koulutus from '#/cypress/data/koulutus';
import { stubKoulutusFormRoutes } from '#/cypress/koulutusFormUtils';
import koulutusMocks from '#/cypress/mocks/koulutus.mocks.json';
import {
  fillKieliversiotSection,
  tallenna,
  assertNoUnsavedChangesDialog,
  getByTestId,
  paste,
  wrapMutationTest,
} from '#/cypress/utils';
import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

const organisaatioOid = '1.1.1.1.1.1';
const koulutusOid = '1.2.3.4.5.6';

const prepareTest = tyyppi => {
  const testKoulutusFields = {
    oid: koulutusOid,
    organisaatioOid: organisaatioOid,
    tarjoajat: ['1.1.1.1.1.1', '1.2.1.1.1.1'],
  };

  stubKoulutusFormRoutes({ organisaatioOid });

  cy.intercept(
    { method: 'GET', url: `**/koulutus/${koulutusOid}/toteutukset` },
    { body: [] }
  );

  cy.intercept({ method: 'GET', url: `**/toteutus/list**` }, { body: [] });

  cy.intercept({ method: 'GET', url: '**/search/koulutus/**' }, { body: [] });

  cy.intercept(
    { method: 'GET', url: `**/koulutus/${koulutusOid}` },
    { body: merge(koulutus({ tyyppi }), testKoulutusFields) }
  );
};

export const editKoulutusForm = () => {
  beforeEach(() => {
    playMocks(koulutusMocks);
  });

  const mutationTest = wrapMutationTest({
    oid: koulutusOid,
    entity: ENTITY.KOULUTUS,
  });

  it(
    'should be able to edit ammatillinen koulutus',
    mutationTest(() => {
      prepareTest('amm');
      cy.visit(
        `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/muokkaus`
      );

      fillKieliversiotSection();

      tallenna();
    })
  );

  it(
    'should be able to edit AMK-koulutus',
    mutationTest(() => {
      prepareTest('amk');
      cy.visit(
        `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/muokkaus`
      );

      fillKieliversiotSection();

      tallenna();
    })
  );

  it(
    'should be able to edit lukiokoulutus',
    mutationTest(() => {
      prepareTest('lk');
      cy.visit(
        `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/muokkaus`
      );

      fillKieliversiotSection();

      tallenna();
    })
  );

  it('should be able to edit TUVA-koulutus', () => {
    prepareTest('tuva');
    cy.visit(
      `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/muokkaus`
    );
    cy.intercept(
      { method: 'POST', url: '**/koulutus' },
      {
        body: {
          muokattu: false,
        },
      }
    ).as('updateTuvaKoulutusResponse');

    getByTestId('linkkiEPerusteisiinInput')
      .find('input')
      .pipe(paste('http://testilinkki.fi'));

    tallenna();

    cy.wait('@updateTuvaKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it("Shouldn't complain about unsaved changes for untouched form", () => {
    prepareTest('amm');
    cy.visit(
      `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/muokkaus`
    );
    assertNoUnsavedChangesDialog();
  });

  it('Should redirect from url without organization', () => {
    prepareTest('amm');
    cy.visit(`/koulutus/${koulutusOid}/muokkaus`);
    cy.url().should(
      'include',
      `/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/koulutus/${koulutusOid}/muokkaus`
    );
  });
};
