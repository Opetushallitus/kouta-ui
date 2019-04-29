import {
  getByTestId,
  getRadio,
  getSelectOption,
  getCheckbox,
  chooseKieliversiotLanguages,
} from '../../utils';

import { stubKoulutusFormRoutes } from '../../koulutusFormUtils';

const fillPohjaSection = cy => {
  getByTestId('pohjaSection', cy).within(() => {
    getByTestId('jatkaButton', cy).click({ force: true });
  });
};

const fillKieliversiotSection = cy => {
  getByTestId('kieliversiotSection', cy).within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
    getByTestId('jatkaButton', cy).click({ force: true });
  });
};

const fillLisatiedotSection = cy => {
  getByTestId('lisatiedotSection', cy).within(() => {
    getByTestId('osiotSelect', cy).click();

    getByTestId('osiotSelect', cy).within(() => {
      getSelectOption('koulutuksenjarjestamisenlisaosiot_0', cy).click({
        force: true,
      });
    });

    getByTestId('osioKuvaus.koulutuksenjarjestamisenlisaosiot_0#1', cy).within(
      () => {
        cy.get('textarea').type('koulutuksenjarjestamisenlisaosiot_0 kuvaus', {
          force: true,
        });
      },
    );

    getByTestId('jatkaButton', cy).click({ force: true });
  });
};

const tallenna = cy => {
  getByTestId('tallennaJaJulkaiseKoulutusButton', cy).click({ force: true });
};

const jatka = cy => {
  getByTestId('jatkaButton', cy).click({ force: true });
};

const fillJarjestajaSection = (cy, jatkaArg = false) => {
  getByTestId('jarjestajaSection', cy).within(() => {
    getByTestId('jarjestajatSelection', cy).within(() => {
      getCheckbox('4.1.1.1.1.1', cy).click({ force: true });
      getCheckbox('2.1.1.1.1.1', cy).click({ force: true });
    });

    jatkaArg && jatka(cy);
  });
};

describe('createKoulutusForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';

  beforeEach(() => {
    stubKoulutusFormRoutes({ cy, organisaatioOid });

    cy.visit(`/organisaatio/${organisaatioOid}/koulutus?johtaaTutkintoon=true`);
  });

  it('should be able to create ammatillinen koulutus', () => {
    cy.route({
      method: 'PUT',
      url: '**/koulutus',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createAmmKoulutusResponse');

    getByTestId('tyyppiSection', cy).within(() => {
      getRadio('amm', cy).click({ force: true });
      getByTestId('jatkaButton', cy).click({ force: true });
    });

    fillPohjaSection(cy);

    fillKieliversiotSection(cy);

    getByTestId('tiedotSection', cy).within(() => {
      getByTestId('koulutustyyppiSelect', cy).click();

      getByTestId('koulutustyyppiSelect', cy).within(() => {
        getSelectOption('koulutus_0', cy).click({ force: true });
      });

      getByTestId('jatkaButton', cy).click({ force: true });
    });

    getByTestId('kuvausSection', cy).within(() => {
      getByTestId('jatkaButton', cy).click({ force: true });
    });

    fillLisatiedotSection(cy);

    fillJarjestajaSection(cy);

    tallenna(cy);

    cy.wait('@createAmmKoulutusResponse').then(({ request }) => {
      expect(request.body).to.deep.equal({
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        tila: 'julkaistu',
        johtaaTutkintoon: true,
        kielivalinta: ['fi'],
        tarjoajat: ['4.1.1.1.1.1', '2.1.1.1.1.1'],
        koulutusKoodiUri: 'koulutus_0#1',
        koulutustyyppi: 'amm',
        nimi: {
          fi: 'Nimi',
        },
        julkinen: false,
        metadata: {
          tyyppi: 'amm',
          lisatiedot: [
            {
              otsikkoKoodiUri: 'koulutuksenjarjestamisenlisaosiot_0#1',
              teksti: {
                fi: 'koulutuksenjarjestamisenlisaosiot_0 kuvaus',
              },
            },
          ],
          kuvaus: {},
          opintojenLaajuusKoodiUri: null,
          tutkintonimikeKoodiUrit: [],
          kuvauksenNimi: {},
        },
      });
    });
  });

  it('should be able to create korkeakoulu koulutus', () => {
    cy.route({
      method: 'PUT',
      url: '**/koulutus',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createYoKoulutusResponse');

    getByTestId('tyyppiSection', cy).within(() => {
      getRadio('yo', cy).click({ force: true });
      jatka(cy);
    });

    fillPohjaSection(cy);

    fillKieliversiotSection(cy);

    getByTestId('tiedotSection', cy).within(() => {
      getByTestId('koulutuskoodiSelect', cy).click();

      getByTestId('koulutuskoodiSelect', cy).within(() => {
        getSelectOption('koulutus_0', cy).click({ force: true });
      });

      getByTestId('nimiInput', cy).within(() => {
        cy.get('input').type('Tiedot nimi', { force: true });
      });

      getByTestId('tutkintonimikeSelect', cy).click();

      getByTestId('tutkintonimikeSelect', cy).within(() => {
        getSelectOption('tutkintonimikekk_0', cy).click({ force: true });
      });

      getByTestId('opintojenLaajuusSelect', cy).click();

      getByTestId('opintojenLaajuusSelect', cy).within(() => {
        getSelectOption('opintojenlaajuus_0', cy).click({ force: true });
      });

      jatka(cy);
    });

    getByTestId('kuvausSection', cy).within(() => {
      getByTestId('kuvauksenNimiInput', cy).within(() => {
        cy.get('input').type('Kuvauksen nimi', { force: true });
      });

      getByTestId('kuvausInput', cy).within(() => {
        cy.get('textarea').type('Kuvaus', { force: true });
      });

      jatka(cy);
    });

    fillLisatiedotSection(cy);

    fillJarjestajaSection(cy, true);

    getByTestId('nakyvyysSection', cy).within(() => {
      getCheckbox('julkinen', cy).click({ force: true });
    });

    tallenna(cy);

    cy.wait('@createYoKoulutusResponse').then(({ request }) => {
      expect(request.body).to.deep.equal({
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        tila: 'julkaistu',
        johtaaTutkintoon: true,
        kielivalinta: ['fi'],
        tarjoajat: ['4.1.1.1.1.1', '2.1.1.1.1.1'],
        koulutusKoodiUri: 'koulutus_0#1',
        koulutustyyppi: 'yo',
        nimi: {
          fi: 'Tiedot nimi',
        },
        julkinen: true,
        metadata: {
          tyyppi: 'yo',
          lisatiedot: [
            {
              otsikkoKoodiUri: 'koulutuksenjarjestamisenlisaosiot_0#1',
              teksti: {
                fi: 'koulutuksenjarjestamisenlisaosiot_0 kuvaus',
              },
            },
          ],
          kuvaus: {
            fi: 'Kuvaus',
          },
          opintojenLaajuusKoodiUri: 'opintojenlaajuus_0#1',
          tutkintonimikeKoodiUrit: ['tutkintonimikekk_0#1'],
          kuvauksenNimi: {
            fi: 'Kuvauksen nimi',
          },
        },
      });
    });
  });
});
