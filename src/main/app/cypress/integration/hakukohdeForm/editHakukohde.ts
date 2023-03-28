import { merge } from 'lodash/fp';

import organisaatio from '#/cypress/data/organisaatio';
import {
  prepareTest,
  fillJarjestyspaikkaSection,
} from '#/cypress/hakukohdeFormUtils';
import {
  assertNoUnsavedChangesDialog,
  confirmDelete,
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  wrapMutationTest,
  stubKayttoOikeusMeRoute,
} from '#/cypress/utils';
import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

export const editHakukohdeForm = () => {
  const organisaatioOid = '1.2.246.562.10.52251087186';
  const hakuOid = '4.1.1.1.1.1';
  const hakukohdeOid = '6.1.1.1.1.1';

  const mutationTest = wrapMutationTest({
    oid: hakukohdeOid,
    entity: ENTITY.HAKUKOHDE,
  });

  it(
    'should be able to edit hakukohde',
    mutationTest(() => {
      prepareTest({
        tyyppi: 'yo',
        hakuOid,
        hakukohdeOid,
        organisaatioOid,
        edit: true,
        tarjoajat: ['1.2.246.562.10.45854578546'],
      });

      fillKieliversiotSection();
      fillJarjestyspaikkaSection();
      tallenna();
    })
  );

  it(
    'should be able to delete hakukohde',
    mutationTest(() => {
      prepareTest({
        tyyppi: 'yo',
        hakuOid,
        hakukohdeOid,
        organisaatioOid,
        edit: true,
        tarjoajat: ['1.2.246.562.10.45854578546'],
      });

      fillKieliversiotSection();
      fillJarjestyspaikkaSection();
      fillTilaSection('poistettu');
      tallenna();
      confirmDelete();
    })
  );

  it("Shouldn't complain about unsaved changes for untouched form", () => {
    prepareTest({
      tyyppi: 'amm',
      hakuOid,
      hakukohdeOid,
      organisaatioOid,
      edit: true,
      tarjoajat: ['1.2.246.562.10.45854578546'],
    });
    assertNoUnsavedChangesDialog();
  });

  it('Should redirect from url without organization', () => {
    prepareTest({
      tyyppi: 'amm',
      hakuOid,
      hakukohdeOid,
      organisaatioOid,
      edit: true,
      tarjoajat: ['1.2.246.562.10.45854578546'],
    });

    cy.intercept(
      {
        method: 'POST',
        url: '**/kouta-backend/organisaatio/organisaatiot',
      },
      {
        body: [
          merge(organisaatio(), {
            oid: organisaatioOid,
          }),
        ],
      }
    );

    cy.visit(`/hakukohde/${hakukohdeOid}/muokkaus`);

    cy.url().should(
      'include',
      `/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/hakukohde/${hakukohdeOid}/muokkaus`
    );
  });

  it('should be possible for Oph-virkailija to update hakukohde if hakukohteen muokkaamistakaraja has expired', () => {
    prepareTest({
      tyyppi: 'lk',
      hakuOid,
      hakukohdeOid,
      organisaatioOid,
      edit: true,
      tarjoajat: ['1.2.246.562.10.45854578546'],
      hakukohteenMuokkaaminenHasExpired: true,
    });

    cy.findByRole('button', {
      name: 'yleiset.tallenna',
    }).should('not.be.disabled');
  });

  it('should not be possible for oppilaitos user to update hakukohde if hakukohteen muokkaamistakaraja has expired', () => {
    prepareTest({
      tyyppi: 'lk',
      hakuOid,
      hakukohdeOid,
      organisaatioOid,
      edit: true,
      tarjoajat: ['1.2.246.562.10.45854578546'],
      hakukohteenMuokkaaminenHasExpired: true,
    });

    stubKayttoOikeusMeRoute({
      user: {
        // roles: JSON.stringify([
        //   'APP_KOUTA',
        //   `APP_KOUTA_HAKUKOHDE_UPDATE_${organisaatioOid}`,
        // ]),
        organisaatiot: [
          {
            organisaatioOid: '1.2.246.562.10.00000000001',
            kayttooikeudet: [
              {
                palvelu: 'KOUTA',
                oikeus: 'OPHPAAKAYTTAJA',
              },
              {
                palvelu: 'KOUTA',
                oikeus: 'HAKUKOHDE_UPDATE',
              },
            ],
          },
        ],
      },
    });
    cy.reload();

    cy.findByRole('button', {
      name: 'hakukohdelomake.muokkaamisenTakarajaYlittynyt',
    }).should('be.disabled');
  });

  it('should be possible for oppilaitos user to update hakukohde if hakukohteen muokkaamistakaraja has not expired', () => {
    prepareTest({
      tyyppi: 'lk',
      hakuOid,
      hakukohdeOid,
      organisaatioOid,
      edit: true,
      tarjoajat: ['1.2.246.562.10.45854578546'],
      hakukohteenMuokkaaminenHasExpired: false,
    });

    stubKayttoOikeusMeRoute({
      user: {
        roles: JSON.stringify([
          'APP_KOUTA',
          `APP_KOUTA_HAKUKOHDE_UPDATE_${organisaatioOid}`,
        ]),
      },
    });
    cy.reload();

    cy.findByRole('button', {
      name: 'yleiset.tallenna',
    }).should('not.be.disabled');
  });

  it("should not be possible for oppilaitos user to update another organizations's hakukohde", () => {
    prepareTest({
      tyyppi: 'lk',
      hakuOid,
      hakukohdeOid,
      organisaatioOid,
      edit: true,
      tarjoajat: ['1.2.246.562.10.45854578546'],
    });

    stubKayttoOikeusMeRoute({
      user: {
        roles: JSON.stringify([
          'APP_KOUTA',
          `APP_KOUTA_HAKUKOHDE_UPDATE_1.2.246.562.10.52251087111`,
        ]),
      },
    });
    cy.reload();

    cy.findByRole('button', {
      name: 'hakukohdelomake.eiMuokkausOikeutta',
    }).should('be.disabled');
  });
};
