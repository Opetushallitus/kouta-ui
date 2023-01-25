import { merge } from 'lodash/fp';

import valintaperuste from '#/cypress/data/valintaperuste';
import {
  getRadio,
  selectOption,
  typeToEditor,
  getTableInput,
  getCheckbox,
  jatka,
  getByTestId,
  paste,
  fillValintakokeetSection,
  fillKieliversiotSection,
  fillPohjaSection,
  fillTilaSection,
  tallenna,
  fillKoulutustyyppiSelect,
  wrapMutationTest,
  fillPohjaSectionCopyingValuesFrom,
  tilaShouldBe,
  fillOrgSection,
} from '#/cypress/utils';
import { stubValintaperusteFormRoutes } from '#/cypress/valintaperusteFormUtils';
import { ENTITY } from '#/src/constants';

const lisaaSisaltoa = tyyppi => {
  getByTestId('sisaltoMenuToggle').click({ force: true });

  getByTestId('sisaltoMenu')
    .first()
    .within(() => {
      if (tyyppi === 'teksti') {
        getByTestId('lisaaTekstia').click({ force: true });
      } else if (tyyppi === 'taulukko') {
        getByTestId('lisaaTaulukko').click({ force: true });
      }
    });
};

const fillValintatapaSection = () => {
  getByTestId('valintatavatSection').within(() => {
    getByTestId('valintatapalista').within(() => {
      getByTestId('tapa').within(() => {
        selectOption('Todistusvalinta');
      });

      getByTestId('nimi').find('input').pipe(paste('Valintatavan nimi'));

      getByTestId('valintatapaSisalto').within(() => {
        lisaaSisaltoa('teksti');

        typeToEditor('Sisältötekstiä');

        lisaaSisaltoa('taulukko');

        getTableInput()
          .find('textarea')
          .invoke('val', '')
          .trigger('paste', {
            clipboardData: {
              getData: () => 'solu1.1\tsolu1.2\rsolu2.1\tsolu2.2',
            },
          });
      });

      getByTestId('kynnysehto').within(() => {
        typeToEditor('Kynnysehto');
      });
      getByTestId('enimmaispistemaara').find('input').pipe(paste('100,02'));
      getByTestId('vahimmaispistemaara').find('input').pipe(paste('10,01'));
    });

    jatka();
  });
};

const fillKuvausSection = () => {
  getByTestId('kuvausSection').within(() => {
    getByTestId('nimi').find('input').pipe(paste('Valintaperusteen nimi'));

    getByTestId('kuvaus').within(() => {
      typeToEditor('Kuvaus');
    });

    getByTestId('sisalto').within(() => {
      lisaaSisaltoa('teksti');

      typeToEditor('Sisältötekstiä');

      lisaaSisaltoa('taulukko');

      getTableInput()
        .find('textarea')
        .invoke('val', '')
        .trigger('paste', {
          clipboardData: {
            getData: () => 'solu1.1\tsolu1.2\rsolu2.1\tsolu2.2',
          },
        });
    });

    jatka();
  });
};

const fillHakukelpoisuusSection = () => {
  getByTestId('hakukelpoisuusSection').within(() => {
    typeToEditor('hakukelpoisuus');

    jatka();
  });
};

const fillLisatiedotSection = () => {
  getByTestId('lisatiedotSection').within(() => {
    typeToEditor('lisatiedot');

    jatka();
  });
};

const fillJulkisuusSection = () => {
  getByTestId('julkinenSection').within(() => {
    getCheckbox(null).check({ force: true });
    jatka();
  });
};

const fillPerustiedotSection = () => {
  getByTestId('perustiedotSection').within(() => {
    fillKoulutustyyppiSelect(['korkeakoulutus', 'yo']);
    fillKieliversiotSection();
    getRadio('hakutapa_01#1').click({ force: true });
    getByTestId('kohdejoukkoSection').within(() => {
      selectOption('Korkeakoulutus');
    });

    jatka();
  });
};

export const createValintaperusteForm = () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const valintaperusteId = '1.2.3.4.5.6';

  beforeEach(() => {
    stubValintaperusteFormRoutes({ organisaatioOid });

    cy.visit(`/organisaatio/${organisaatioOid}/valintaperusteet/kielivalinnat`);
  });

  const mutationTest = wrapMutationTest({
    id: valintaperusteId,
    entity: ENTITY.VALINTAPERUSTE,
  });

  it(
    'should be able to create valintaperuste',
    mutationTest(() => {
      cy.intercept(
        { method: 'GET', url: `**/valintaperuste/${valintaperusteId}` },
        {
          body: [
            merge(valintaperuste(), {
              oid: valintaperusteId,
            }),
          ],
        }
      );

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillPerustiedotSection();
      fillHakukelpoisuusSection();
      fillKuvausSection();
      fillValintatapaSection();
      fillValintakokeetSection();
      fillLisatiedotSection();
      fillJulkisuusSection();
      fillTilaSection();

      tallenna();

      cy.location('pathname').should(
        'eq',
        `/kouta/organisaatio/${organisaatioOid}/valintaperusteet/${valintaperusteId}/muokkaus`
      );
    })
  );

  it('using an existing object as baseline it should not copy publishing state', () => {
    fillPohjaSectionCopyingValuesFrom('Valintaperusteen nimi');
    fillOrgSection(organisaatioOid);
    fillPerustiedotSection();
    fillHakukelpoisuusSection();
    fillKuvausSection();
    tilaShouldBe('tallennettu');
  });
};
