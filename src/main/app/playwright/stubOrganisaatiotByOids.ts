import { type Page } from '@playwright/test';
import { merge } from 'lodash';

import organisaatio from '#/playwright/fixtures/organisaatio';
import organisaatioHierarkia from '#/playwright/fixtures/organisaatioHierarkia';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';
import { type OrganisaatioModel } from '#/src/types/domainTypes';

type Organisaatio = Serializable & { oid: string };

// Vastaa POST /organisaatio/organisaatiot -kutsuun pyynnön rungossa olevilla oideilla,
// pyydetyssä järjestyksessä. stubOrganisaatioRoutes palauttaa aina saman yhden
// organisaation oideista riippumatta, mikä riittää lomaketesteihin mutta ei silloin,
// kun testi erottaa organisaatiot toisistaan nimen perusteella: valittu organisaatio
// otsikossa, suosikkilista ja tallennettu valinta luetaan kaikki tämän kutsun kautta.
export const stubOrganisaatiotByOids = async (
  page: Page,
  organisaatiot: Array<Organisaatio>
) => {
  await page.route('**/kouta-backend/organisaatio/organisaatiot', route => {
    if (route.request().method() !== 'POST') {
      return route.fallback();
    }
    const oids: Array<string> = route.request().postDataJSON() ?? [];
    return route.fulfill({
      json: oids
        .map(oid => organisaatiot.find(o => o.oid === oid))
        .filter(Boolean),
    });
  });
};

// organisaatioHierarkia-fixturen organisaatiot litteänä listana sekä Opetushallitus,
// jonka OPH-käyttäjän etusivu valitsee oletuksena.
export const hierarkiaOrganisaatiot = (): Array<Organisaatio> => {
  const flatten = (orgs: Array<OrganisaatioModel>): Array<Organisaatio> =>
    orgs.flatMap(org => [
      merge(organisaatio(), {
        oid: org.oid,
        nimi: org.nimi,
        organisaatiotyyppiUris: org.organisaatiotyyppiUris,
      }),
      ...flatten(org.children ?? []),
    ]);

  return [
    merge(organisaatio(), {
      oid: OPETUSHALLITUS_ORGANISAATIO_OID,
      nimi: { fi: 'Opetushallitus' },
    }),
    ...flatten(organisaatioHierarkia().organisaatiot),
  ];
};
