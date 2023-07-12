import {
  fixtureFromFile,
  fixtureJSON,
  mocksFromFile,
} from './playwright-mock-utils';
import { stubCommonRoutes } from './stubCommonRoutes';
import { stubOrganisaatioRoutes } from './stubOrganisaatioRoutes';
import toteutusListItems from './toteutusListItems';

export const stubToteutusRoutes = async (page, organisaatioOid) => {
  await stubCommonRoutes(page);
  await mocksFromFile(page, 'koulutus.mocks.json');
  await mocksFromFile(page, 'toteutus.mocks.json');

  await stubOrganisaatioRoutes(page, organisaatioOid);
  await page.route(
    '**/koodisto-service/rest/json/osaamisala/koodi*',
    fixtureFromFile('osaamisala-koodisto.json')
  );

  await page.route('**/haku/list*', fixtureJSON([]));

  await page.route(
    '**/toteutus/list*',
    fixtureJSON(toteutusListItems(organisaatioOid))
  );

  await page.route(
    '**/toteutus/1.2.246.562.17.00000000000000008265',
    fixtureJSON(toteutusListItems(organisaatioOid)[0])
  );

  await page.route(
    '**/toteutus/opintojaksot/list*',
    fixtureJSON(toteutusListItems(organisaatioOid))
  );
  await page.route('**/sorakuvaus/list*', fixtureJSON([]));
  await page.route('**/ammattinimike/search/*', fixtureJSON([]));
  await page.route('**/asiasana/search/*', fixtureJSON([]));
  await page.route('**/search/toteutus/*', fixtureJSON([]));
};
