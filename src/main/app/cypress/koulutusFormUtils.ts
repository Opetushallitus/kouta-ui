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

export const stubKoulutusFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();

  cy.route({
    method: 'GET',
    url: `**/organisaatio-service/rest/organisaatio/v4/hierarkia/hae**`,
    response: organisaatioHierarkia({ rootOid: organisaatioOid }),
  });

  cy.route({
    method: 'GET',
    url: `**/organisaatio-service/rest/organisaatio/v4/${organisaatioOid}**`,
    response: merge(organisaatio(), {
      oid: organisaatioOid,
    }),
  });

  cy.route({
    method: 'POST',
    url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
    response: [
      merge(organisaatio(), {
        oid: organisaatioOid,
      }),
    ],
  });

  cy.route({
    method: 'GET',
    url:
      '**/koodisto-service/rest/json/relaatio/sisaltyy-ylakoodit/koulutustyyppi_*',
    response: koodisto({ koodisto: 'koulutus' }),
  });

  cy.route({
    method: 'GET',
    url: `**/koulutus/list?organisaatioOid=${organisaatioOid}`,
    response: [],
  });

  cy.route({
    method: 'GET',
    url: `**/koulutus/*/toteutukset/list**`,
    response: [],
  });

  cy.route({
    method: 'GET',
    url: '**/koodisto-service/rest/codeelement/koulutus_351107/**',
    response: koodistoKoulutus351107,
  });

  cy.route({
    method: 'GET',
    url:
      '**/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/koulutus_351107**',
    response: koodistoKoulutus351107Alakoodit,
  });

  cy.route({
    method: 'GET',
    url: '**/koodisto-service/rest/codeelement/koulutus_309902/**',
    response: koodistoKoulutus309902,
  });

  cy.route({
    method: 'GET',
    url:
      '**/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/koulutus_309902**',
    response: koodistoKoulutus309902Alakoodit,
  });

  cy.route({
    method: 'GET',
    url: '**/koodisto-service/rest/codeelement/koulutus_671112/**',
    response: koodistoKoulutus671112,
  });

  cy.route({
    method: 'GET',
    url:
      '**/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/koulutus_671112**',
    response: koodistoKoulutus671112Alakoodit,
  });

  cy.route({
    method: 'GET',
    url: '**/koodisto-service/rest/json/koulutus/koodi?onlyValidKoodis=true**',
    response: koodistoKoulutukset,
  });

  cy.route({
    method: 'GET',
    url: '**/eperusteet-service/api/perusteenosat/6777674',
    response: ePerustePerusteenosat6777674,
  });

  cy.route({
    method: 'GET',
    url: '**/eperusteet-service/api/perusteenosat/6778360',
    response: ePerustePerusteenosat6778360,
  });

  cy.route({
    method: 'GET',
    url: '**/eperusteet-service/api/perusteenosat/6778360',
    response: ePerustePerusteenosat6778360,
  });

  cy.route({
    method: 'GET',
    url: '**/tutkinnonosat',
    response: ePeruste6777660TutkinnonOsat,
  });

  cy.route({
    method: 'GET',
    url:
      '**/eperusteet-service/api/perusteet/6777660/suoritustavat/reformi/rakenne',
    response: ePeruste6777660Rakenne,
  });

  cy.route({
    method: 'GET',
    url: '**/eperusteet-service/api/perusteet/6777660',
    response: ePeruste6777660,
  });

  stubEPerusteetByKoulutuskoodiRoute();

  stubKoodistoRoute({ koodisto: 'tutkintonimikekk' });
  stubKoodistoRoute({ koodisto: 'opintojenlaajuus' });
  stubKoodistoRoute({ koodisto: 'koulutuksenlisatiedot' });

  stubKoodistoRoute({
    koodisto: 'kansallinenkoulutusluokitus2016koulutusalataso2',
  });

  stubOppijanumerorekisteriHenkiloRoute();
};
