import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import _ from 'lodash';

import createSoraKuvaus from '#/cypress/data/soraKuvaus';
import soraKuvausMocks from '#/cypress/mocks/soraKuvaus.mock.json';
import { stubSoraKuvausFormRoutes } from '#/cypress/soraKuvausFormUtils';
import {
  typeToEditor,
  getByTestId,
  jatka,
  paste,
  fillKieliversiotSection,
  fillPohjaSection,
  fillTilaSection,
  tallenna,
  fillKoulutustyyppiSelect,
  fillAsyncSelect,
  wrapMutationTest,
} from '#/cypress/utils';
import { ENTITY } from '#/src/constants';

const fillKoulutustyyppiSection = () => {
  getByTestId('koulutustyyppiSection').within(() => {
    fillKoulutustyyppiSelect(['amm']);
    cy.findByTestId('koulutusala').within(() => {
      fillAsyncSelect('Arkkitehtuuri ja rakentaminen');
    });

    cy.findByTestId('koulutukset').within(() => {
      fillAsyncSelect('Rakennusarkkitehti (AMK)');
    });
    jatka();
  });
};

const fillTiedotSection = () => {
  getByTestId('tiedotSection').within(() => {
    getByTestId('nimi').find('input').pipe(paste('Nimi'));

    getByTestId('kuvaus').within(() => {
      typeToEditor('Kuvaus');
    });

    jatka();
  });
};
export const createSoraKuvausForm = () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const soraKuvaus = createSoraKuvaus();

  beforeEach(() => {
    playMocks(soraKuvausMocks);
    stubSoraKuvausFormRoutes({ organisaatioOid });

    cy.visit(`/organisaatio/${organisaatioOid}/sora-kuvaus/kielivalinnat/`);
  });

  const mutationTest = wrapMutationTest({
    entity: ENTITY.SORA_KUVAUS,
    id: soraKuvaus.id,
  });

  it(
    'should be able to create sora-kuvaus',
    mutationTest(() => {
      fillKoulutustyyppiSection();
      fillPohjaSection();
      fillKieliversiotSection({ jatka: true });
      fillTiedotSection();
      fillTilaSection();

      tallenna();

      cy.location('pathname').should(
        'eq',
        `/kouta/organisaatio/${organisaatioOid}/sora-kuvaus/${soraKuvaus.id}/muokkaus`
      );
    })
  );
};
