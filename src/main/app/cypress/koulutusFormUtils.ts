import { merge } from 'lodash';

import {
  stubKoodistoRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubEPerusteetByKoulutuskoodiRoute,
  stubCommonRoutes,
} from '#/cypress/utils';
import organisaatioHierarkia from '#/cypress/data/organisaatioHierarkia';
import organisaatio from '#/cypress/data/organisaatio';
import koodisto from '#/cypress/data/koodisto';
import koodistoKoulutus351107 from './data/koodistoKoulutus351107';
import koodistoKoulutukset from './data/koodistoKoulutukset';
import koodistoKoulutus351107Alakoodit from './data/koodistoKoulutus351107Alakoodit';
import koodistoKoulutus309902 from './data/koodistoKoulutus309902';
import koodistoKoulutus309902Alakoodit from './data/koodistoKoulutus309902Alakoodit';
import koodistoKoulutus671112 from './data/koodistoKoulutus671112';
import koodistoKoulutus671112Alakoodit from './data/koodistoKoulutus671112Alakoodit';
import ePerustePerusteenosat6777674 from './data/ePerustePerusteenosat6777674';
import ePerustePerusteenosat6778360 from './data/ePerustePerusteenosat6778360';
import ePeruste6777660TutkinnonOsat from './data/ePeruste6777660TutkinnonOsat';
import ePeruste6777660Rakenne from './data/ePeruste6777660Rakenne';
import ePeruste6777660 from './data/ePeruste6777660';
import ePeruste6777660Osaamisalakuvaukset from './data/ePeruste6777660Osaamisalakuvaukset';
import ePeruste6777660Sisalto from './data/ePeruste6777660Sisalto';

export const stubKoulutusFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();

  cy.intercept(
    {
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/hierarkia/hae**`,
    },
    { body: organisaatioHierarkia({ rootOid: organisaatioOid }) }
  );

  cy.intercept(
    {
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/${organisaatioOid}**`,
    },
    {
      body: merge(organisaatio(), {
        oid: organisaatioOid,
      }),
    }
  );

  cy.intercept(
    {
      method: 'POST',
      url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
    },
    {
      body: [
        merge(organisaatio(), {
          oid: organisaatioOid,
        }),
      ],
    }
  );

  cy.intercept(
    {
      method: 'GET',
      url:
        '**/koodisto-service/rest/json/relaatio/sisaltyy-ylakoodit/koulutustyyppi_*',
    },
    { body: koodisto({ koodisto: 'koulutus' }) }
  );

  cy.intercept(
    {
      method: 'GET',
      url: `**/koulutus/list?organisaatioOid=${organisaatioOid}`,
    },
    { body: [] }
  );

  cy.intercept(
    { method: 'GET', url: `**/koulutus/*/toteutukset/list**` },
    { body: [] }
  );

  cy.intercept(
    {
      method: 'GET',
      url: '**/koodisto-service/rest/codeelement/koulutus_351107/**',
    },
    { body: koodistoKoulutus351107 }
  );

  cy.intercept(
    {
      method: 'GET',
      url:
        '**/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/koulutus_351107**',
    },
    { body: koodistoKoulutus351107Alakoodit }
  );

  cy.intercept(
    {
      method: 'GET',
      url: '**/koodisto-service/rest/codeelement/koulutus_309902/**',
    },
    { body: koodistoKoulutus309902 }
  );

  cy.intercept(
    {
      method: 'GET',
      url:
        '**/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/koulutus_309902**',
    },
    { body: koodistoKoulutus309902Alakoodit }
  );

  cy.intercept(
    {
      method: 'GET',
      url: '**/koodisto-service/rest/codeelement/koulutus_671112/**',
    },
    { body: koodistoKoulutus671112 }
  );

  cy.intercept(
    {
      method: 'GET',
      url:
        '**/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/koulutus_671112**',
    },
    { body: koodistoKoulutus671112Alakoodit }
  );

  cy.intercept(
    {
      method: 'GET',
      url:
        '**/koodisto-service/rest/json/koulutus/koodi?onlyValidKoodis=true**',
    },
    { body: koodistoKoulutukset }
  );

  cy.intercept(
    { method: 'GET', url: '**/eperusteet-service/api/perusteenosat/6777674' },
    { body: ePerustePerusteenosat6777674 }
  );

  cy.intercept(
    { method: 'GET', url: '**/eperusteet-service/api/perusteenosat/6778360' },
    { body: ePerustePerusteenosat6778360 }
  );

  cy.intercept(
    { method: 'GET', url: '**/eperusteet-service/api/perusteenosat/6778360' },
    { body: ePerustePerusteenosat6778360 }
  );

  cy.intercept(
    { method: 'GET', url: '**/tutkinnonosat' },
    { body: ePeruste6777660TutkinnonOsat }
  );

  cy.intercept(
    {
      method: 'GET',
      url:
        '**/eperusteet-service/api/perusteet/6777660/suoritustavat/reformi/rakenne',
    },
    { body: ePeruste6777660Rakenne }
  );

  cy.intercept(
    { method: 'GET', url: '**/eperusteet-service/api/perusteet/6777660' },
    { body: ePeruste6777660 }
  );

  cy.intercept(
    {
      method: 'GET',
      url: '**/eperusteet-service/api/perusteet/6777660/osaamisalakuvaukset',
    },
    { body: ePeruste6777660Osaamisalakuvaukset }
  );

  cy.intercept(
    {
      method: 'GET',
      url:
        '**/eperusteet-service/api/perusteet/6777660/suoritustavat/reformi/sisalto',
    },
    { body: ePeruste6777660Sisalto }
  );

  stubEPerusteetByKoulutuskoodiRoute();

  stubKoodistoRoute({ koodisto: 'tutkintonimikekk' });
  stubKoodistoRoute({ koodisto: 'opintojenlaajuus' });
  stubKoodistoRoute({ koodisto: 'koulutuksenlisatiedot' });

  stubKoodistoRoute({
    koodisto: 'kansallinenkoulutusluokitus2016koulutusalataso2',
  });

  stubOppijanumerorekisteriHenkiloRoute();
};
