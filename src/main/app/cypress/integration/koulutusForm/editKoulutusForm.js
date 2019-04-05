import merge from 'lodash/merge';

import { getByTestId } from '../../utils';
import koulutus from '../../data/koulutus';
import { stubKoulutusFormRoutes } from '../../koulutusFormUtils';

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

    tallenna(cy);

    cy.wait('@updateAmmKoulutusResponse').then(({ request }) => {
      expect(request.body).to.deep.equal({
        oid: koulutusOid,
        koulutustyyppi: 'amm',
        koulutusKoodiUri: 'koulutus_0#1',
        tila: 'tallennettu',
        tarjoajat: ['4.1.1.1.1.1', '2.1.1.1.1.1'],
        nimi: {
          fi: 'Maatalousalan perustutkinto',
          sv: 'Grundexamen inom lantbruksbranschen',
        },
        metadata: {
          tyyppi: 'amm',
          lisatiedot: [
            {
              otsikkoKoodiUri: 'koulutuksenjarjestamisenlisaosiot_0#1',
              teksti: { fi: 'koulutuksenjarjestamisenlisaosiot_0 kuvaus' },
            },
          ],
          kuvaus: {},
          opintojenLaajuusKoodiUri: null,
          tutkintonimikeKoodiUrit: [],
          kuvauksenNimi: {},
        },
        julkinen: false,
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: organisaatioOid,
        kielivalinta: ['fi', 'sv'],
        modified: '2019-04-01T13:01',
      });
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

    tallenna(cy);

    cy.wait('@updateYoKoulutusResponse').then(({ request }) => {
      expect(request.body).to.deep.equal({
        oid: '1.2.3.4.5.6',
        koulutustyyppi: 'yo',
        koulutusKoodiUri: 'koulutus_0#1',
        tila: 'tallennettu',
        tarjoajat: ['4.1.1.1.1.1', '2.1.1.1.1.1'],
        nimi: { fi: 'Fi nimi', sv: 'Sv nimi' },
        metadata: {
          tyyppi: 'yo',
          lisatiedot: [
            {
              otsikkoKoodiUri: 'koulutuksenjarjestamisenlisaosiot_0#1',
              teksti: { fi: 'koulutuksenjarjestamisenlisaosiot_0 kuvaus' },
            },
          ],
          kuvaus: { fi: 'Fi kuvaus', sv: 'Sv kuvaus' },
          opintojenLaajuusKoodiUri: 'opintojenlaajuus_1#1',
          tutkintonimikeKoodiUrit: [
            'tutkintonimikekk_1#1',
            'tutkintonimikekk_2#1',
          ],
          kuvauksenNimi: { fi: 'Fi kuvauksen nimi', sv: 'Sv kuvauksen nimi' },
        },
        julkinen: true,
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi', 'sv'],
        modified: '2019-04-01T13:01',
        johtaaTutkintoon: true,
      });
    });
  });
});
