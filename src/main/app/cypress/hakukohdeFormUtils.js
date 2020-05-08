import { merge } from 'lodash';

import {
  stubKoodistoRoute,
  stubHakemuspalveluLomakkeetRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubKoodiRoute,
} from './utils';

import organisaatio from './data/organisaatio';
import haku from './data/haku';
import hakukohde from './data/hakukohde';
import createKoodi from './data/koodi';
import koulutus from './data/koulutus';
import toteutus from './data/toteutus';
import valintaperuste from './data/valintaperuste';

export const prepareTest = ({
  tyyppi,
  hakuOid,
  hakukohdeOid,
  organisaatioOid,
  edit,
}) => {
  const toteutusOid = '2.1.1.1.1.1';
  const koulutusOid = '3.1.1.1.1';
  const valintaperusteOid = '5.1.1.1.1.1';

  const testHakukohdeFields = {
    toteutusOid,
    hakuOid,
    organisaatioOid,
    oid: hakukohdeOid,
  };

  cy.server();

  stubHakukohdeFormRoutes({ cy, organisaatioOid, hakuOid });

  cy.route({
    method: 'GET',
    url: `**/toteutus/${toteutusOid}`,
    response: merge(toteutus({ tyyppi }), {
      oid: toteutusOid,
      organisaatioOid: organisaatioOid,
      koulutusOid: koulutusOid,
      tila: 'julkaistu',
    }),
  });

  cy.route({
    method: 'GET',
    url: `**/koulutus/${koulutusOid}`,
    response: merge(koulutus({ tyyppi }), {
      oid: koulutusOid,
      organisaatioOid: organisaatioOid,
      tila: 'julkaistu',
    }),
  });

  cy.route({
    method: 'GET',
    url: '**/valintaperuste/list**',
    response: [
      merge(valintaperuste(), {
        oid: valintaperusteOid,
        nimi: { fi: 'Valintaperusteen nimi' },
        tila: 'julkaistu',
      }),
    ],
  });

  cy.route({
    method: 'GET',
    url: `**/hakukohde/${hakukohdeOid}`,
    response: merge(hakukohde(), testHakukohdeFields),
  });

  edit
    ? cy
        .route({
          method: 'POST',
          url: '**/hakukohde',
          response: {
            muokattu: false,
          },
        })
        .as('updateHakukohdeRequest')
    : cy
        .route({
          method: 'PUT',
          url: '**/hakukohde',
          response: {
            oid: hakukohdeOid,
          },
        })
        .as('createHakukohdeRequest');

  cy.visit(
    edit
      ? `/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
      : `/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/haku/${hakuOid}/hakukohde`,
  );
};

export const stubHakukohdeFormRoutes = ({ cy, organisaatioOid, hakuOid }) => {
  cy.server();

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

  stubKoodistoRoute({ koodisto: 'pohjakoulutusvaatimustoinenaste', cy });
  stubKoodistoRoute({ koodisto: 'kausi', cy });
  stubKoodistoRoute({ koodisto: 'valintakokeentyyppi', cy });
  stubKoodistoRoute({ koodisto: 'liitetyypitamm', cy });
  stubKoodistoRoute({ koodisto: 'kausi', cy });
  stubKoodiRoute(createKoodi({ koodisto: 'posti', versio: 2 }));

  cy.route({
    method: 'GET',
    url: `**/haku/${hakuOid}`,
    response: merge(haku(), {
      oid: hakuOid,
      organisaatioOid: organisaatioOid,
      hakulomaketyyppi: 'muu',
      tila: 'julkaistu',
    }),
  });

  cy.route({
    method: 'GET',
    url: `**/hakukohde/list**`,
    response: [],
  });

  stubHakemuspalveluLomakkeetRoute({ cy });
  stubOppijanumerorekisteriHenkiloRoute({ cy });
};
