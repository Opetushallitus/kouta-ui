import { merge } from 'lodash';

import {
  stubKoodistoRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubKoodiRoute,
  stubCommonRoutes,
} from './utils';

import organisaatio from './data/organisaatio';
import soraKuvaus from './data/soraKuvaus';
import createKoodi from './data/koodi';

export const stubValintaperusteFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();

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
    url: '**/valintaperuste/list**',
    response: [],
  });

  cy.route({
    method: 'GET',
    url: '**/sorakuvaus/list**',
    response: [...new Array(10)].map((v, i) =>
      merge(soraKuvaus(), {
        nimi: { fi: `Sora-kuvaus ${i}` },
        id: i.toString(),
        tila: 'julkaistu',
      })
    ),
  });

  stubKoodistoRoute({ koodisto: 'hakutapa' });
  stubKoodistoRoute({ koodisto: 'haunkohdejoukko' });
  stubKoodistoRoute({ koodisto: 'valintatapajono' });
  stubKoodistoRoute({ koodisto: 'kielitaidonosoittaminen' });
  stubKoodistoRoute({ koodisto: 'kielitaitovaatimustyypit' });
  stubKoodistoRoute({ koodisto: 'kielitaitovaatimustyypitkuvaus' });
  stubKoodistoRoute({ koodisto: 'kieli' });
  stubKoodistoRoute({ koodisto: 'osaamistausta' });
  stubKoodistoRoute({ koodisto: 'valintakokeentyyppi' });

  cy.route({
    method: 'GET',
    url: '**/sorakuvaus/1',
    response: merge(soraKuvaus(), {
      nimi: { fi: `Sora-kuvaus 1` },
      id: 1,
      tila: 'julkaistu',
    }),
  });

  stubKoodiRoute(createKoodi({ koodisto: 'posti', versio: 2 }));
  stubKoodiRoute(
    createKoodi({ koodisto: 'posti', koodiArvo: '00350', versio: 1 })
  );

  stubOppijanumerorekisteriHenkiloRoute();
};
