import merge from 'lodash/merge';

import { stubKoodistoRoute, getByTestId } from '../../utils';

import organisaatio from '../../data/organisaatio';
import koodisto from '../../data/koodisto';
import organisaatioHierarkia from '../../data/organisaatioHierarkia';
import koulutus from '../../data/koulutus';

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

    cy.route({
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/hierarkia/hae?oid=${organisaatioOid}**`,
      response: organisaatioHierarkia({ rootOid: organisaatioOid }),
    });

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

    cy.route({
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/${organisaatioOid}**`,
      response: merge(organisaatio(), {
        oid: organisaatioOid,
      }),
    });

    stubKoodistoRoute({ koodisto: 'koulutuksenjarjestamisenlisaosiot', cy });

    cy.route({
      method: 'GET',
      url:
        '**/koodisto-service/rest/json/relaatio/sisaltyy-ylakoodit/koulutustyyppi_*',
      response: koodisto({ koodisto: 'koulutus' }),
    });

    cy.route({
      method: 'GET',
      url: '**/kouta-backend/koulutus/list**',
      response: [],
    });

    cy.route({
      method: 'GET',
      url: '**/koodisto-service/rest/codeelement/koulutus_0',
      response: [
        {
          koodiUri: 'koulutus_0',
          versio: 1,
          metadata: [{ kieli: 'fi', nimi: 'Nimi' }],
        },
      ],
    });

    cy.route({
      method: 'GET',
      url:
        '**/eperusteet-service/api/perusteet?tuleva=true&siirtyma=false&voimassaolo=true&poistunut=false&kieli=fi&koulutuskoodi=koulutus_0',
      response: {
        data: [
          {
            kuvaus: { fi: 'koulutus_0 kuvaus' },
            osaamisalat: [],
            tutkintonimikeKoodiUri: 'nimike_1#1',
            id: '1',
          },
        ],
      },
    });

    cy.route({
      method: 'GET',
      url:
        '**/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/koulutus_0**',
      response: [
        {
          koodiUri: 'okmohjauksenala_1',
          metadata: [{ kieli: 'fi', nimi: 'Ala' }],
        },
        {
          koodiUri: 'opintojenlaajuus_1',
          metadata: [{ kieli: 'fi', nimi: '180' }],
        },
        {
          koodiUri: 'opintojenlaajuusyksikko_1',
          metadata: [{ kieli: 'fi', nimi: 'op' }],
        },
      ],
    });

    stubKoodistoRoute({ koodisto: 'tutkintonimikekk', cy });

    stubKoodistoRoute({ koodisto: 'opintojenlaajuus', cy });

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
