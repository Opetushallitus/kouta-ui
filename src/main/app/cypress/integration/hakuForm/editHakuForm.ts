import { sub } from 'date-fns';
import { merge } from 'lodash/fp';

import haku from '#/cypress/data/haku';
import { stubHakuFormRoutes } from '#/cypress/hakuFormUtils';
import {
  assertNoUnsavedChangesDialog,
  fillKieliversiotSection,
  tallenna,
  wrapMutationTest,
  stubKayttoOikeusMeRoute,
} from '#/cypress/utils';
import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

const organisaatioOid = '1.1.1.1.1.1';
const hakuOid = '2.1.1.1.1.1';

export const editHakuForm = () => {
  const mutationTest = wrapMutationTest({
    oid: hakuOid,
    entity: ENTITY.HAKU,
  });

  beforeEach(() => {
    stubHakuFormRoutes({ organisaatioOid });

    cy.intercept(
      { method: 'GET', url: `**/haku/${hakuOid}/hakukohteet/list**` },
      { body: [] }
    );

    cy.intercept({ method: 'GET', url: `**/toteutus/list**` }, { body: [] });

    cy.intercept(
      { method: 'GET', url: `**/haku/${hakuOid}` },
      {
        body: merge(haku(), {
          oid: hakuOid,
          organisaatioOid: organisaatioOid,
        }),
      }
    );
  });

  it(
    'should be able to edit haku',
    mutationTest(() => {
      cy.visit(`/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`);

      fillKieliversiotSection();

      tallenna();
    })
  );

  it("Shouldn't complain about unsaved changes for untouched form", () => {
    cy.visit(`/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`);
    assertNoUnsavedChangesDialog();
  });

  it('Should redirect from url without organization', () => {
    cy.visit(`/haku/${hakuOid}/muokkaus`);
    cy.url().should(
      'include',
      `/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/haku/${hakuOid}/muokkaus`
    );
  });

  it('should not be possible for oppilaitos user to add hakukohde for haku with expired liittämistakaraja', () => {
    stubKayttoOikeusMeRoute({
      user: {
        roles: JSON.stringify(['APP_KOUTA']),
      },
    });

    cy.visit(`/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`);
    cy.findByText('yleiset.liitaHakukohde', { selector: 'button' }).should(
      'be.disabled'
    );
  });

  it('should be possible for OPH virkailija to add hakukohde for haku with expired liittämistakaraja', () => {
    cy.visit(`/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`);
    cy.findByText('yleiset.liitaHakukohde', { selector: 'button' }).should(
      'not.be.disabled'
    );
  });

  it('should be possible for oppilaitos user to add hakukohde for haku without expired liittämistakaraja', () => {
    const hakuMockData = haku();
    const takaraja = hakuMockData.hakukohteenLiittamisenTakaraja;
    const oneDayBeforeDeadline = sub(new Date(takaraja), { days: 1 });
    cy.clock(oneDayBeforeDeadline, ['Date']);

    stubKayttoOikeusMeRoute({
      user: {
        roles: JSON.stringify(['APP_KOUTA']),
      },
    });

    cy.intercept(
      { method: 'GET', url: `**/haku/${hakuOid}` },
      {
        body: merge(hakuMockData, {
          oid: hakuOid,
          organisaatioOid: organisaatioOid,
        }),
      }
    );
    cy.visit(`/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`);
    cy.findByText('yleiset.liitaHakukohde', { selector: 'button' }).should(
      'not.be.disabled'
    );
  });

  it('should be possible for oppilaitos user to add hakukohde for haku if liittämistakaraja has not been set', () => {
    const hakuMockData = haku();
    hakuMockData.hakukohteenLiittamisenTakaraja = null;

    stubKayttoOikeusMeRoute({
      user: {
        roles: JSON.stringify(['APP_KOUTA']),
      },
    });

    cy.intercept(
      { method: 'GET', url: `**/haku/${hakuOid}` },
      {
        body: merge(hakuMockData, {
          oid: hakuOid,
          organisaatioOid: organisaatioOid,
        }),
      }
    );
    cy.visit(`/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`);
    cy.findByText('yleiset.liitaHakukohde', { selector: 'button' }).should(
      'not.be.disabled'
    );
  });
};
