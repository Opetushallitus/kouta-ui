import { expect, test, type Locator, type Page } from '@playwright/test';

import organisaatioHierarkia from '#/playwright/fixtures/organisaatioHierarkia';
import { fixtureJSON } from '#/playwright/playwright-mock-utils';
import { stubCommonRoutes } from '#/playwright/stubCommonRoutes';
import {
  hierarkiaOrganisaatiot,
  stubOrganisaatiotByOids,
} from '#/playwright/stubOrganisaatiotByOids';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

// Organisaation valinta ja suosikit etusivulla. Nämä ovat redux-storen kaksi jäljellä
// olevaa käyttökohdetta (organisaatioSelection ja organisaatioFavourites, molemmat
// redux-persistin takana), ja testit kirjaavat nykyisen käytöksen ennen storen
// korvaamista: mitä valinta tekee URL:lle ja listoille, mikä säilyy sivun
// uudelleenlatauksen yli ja missä järjestyksessä suosikit näytetään.
//
// Käyttäjä on OPH-pääkäyttäjä (stubCommonRoutes), joten organisaatiopuu näytetään vasta
// vähintään kolmen merkin haulla, ja Opetushallitus on oletusvalinta.

const ROOT_OID = '1.1.1.1.1.1'; // Organisaatio_1
const OPPILAITOS_OID = '1.2.1.1.1.1'; // Organisaatio_1_1

const openDrawer = async (page: Page) => {
  await page.getByTestId('toggleOrganisaatioDrawer').click();
  return page.getByTestId('organisaatioDrawer');
};

const searchHierarkia = async (drawer: Locator) => {
  await drawer.getByRole('textbox').fill('Org');
  await expect(
    drawer
      .getByTestId('organisaatioList')
      .getByRole('radio', { name: 'Organisaatio_1', exact: true })
  ).toBeAttached();
};

// Puun rivi nimen mukaan. Sama nimi voi olla yhtä aikaa puussa ja suosikkilistassa,
// siksi rajaus organisaatioListiin.
const treeRow = (drawer: Locator, name: string) =>
  drawer
    .getByTestId('organisaatioList')
    .getByTestId('organisaatioItem')
    .filter({ has: drawer.page().getByRole('radio', { name, exact: true }) });

const favouriteRow = (drawer: Locator, name: string) =>
  drawer.getByTestId('organization-favourites').filter({ hasText: name });

const star = (row: Locator) => row.getByTitle('etusivu.lisaaSuosikkeihin');

// Radio on piilotettu visuaalisesti, joten valinta tehdään labelin tekstistä.
const pick = (row: Locator, name: string) =>
  row.getByText(name, { exact: true }).click();

// Valinta astuu voimaan vasta kun laatikko sulkeutuu (OrganisaatioDrawer:
// saveOrganisaatioIfChanged).
const closeDrawer = (drawer: Locator) =>
  drawer.getByRole('button', { name: 'yleiset.valitse' }).click();

// Avaa laatikon, hakee puun, avaa juuren ja valitsee oppilaitoksen.
const selectOppilaitosFromTree = async (page: Page) => {
  const drawer = await openDrawer(page);
  await searchHierarkia(drawer);
  await treeRow(drawer, 'Organisaatio_1')
    .getByRole('button', { name: 'arrow_drop_down' })
    .click();
  await pick(treeRow(drawer, 'Organisaatio_1_1'), 'Organisaatio_1_1');
  return drawer;
};

const expectSelected = async (page: Page, oid: string, name: string) => {
  await expect(page).toHaveURL(new RegExp(`organisaatioOid=${oid}$`));
  await expect(page.getByTestId('selectedOrganisaatio')).toHaveText(name);
};

test.describe('Organisaation valinta ja suosikit', () => {
  test.beforeEach(async ({ page }) => {
    await stubCommonRoutes(page);
    await stubOrganisaatiotByOids(page, hierarkiaOrganisaatiot());
    await page.route(
      '**/kouta-backend/organisaatio/hierarkia*',
      fixtureJSON(organisaatioHierarkia())
    );
    await page.route(
      '**/kayttooikeus-service/organisaatiohenkilo/organisaatioOid',
      fixtureJSON([OPETUSHALLITUS_ORGANISAATIO_OID])
    );
    await page.route('**/kouta-backend/**/list*', fixtureJSON([]));
    await page.goto('/kouta/');
    await expectSelected(
      page,
      OPETUSHALLITUS_ORGANISAATIO_OID,
      'Opetushallitus'
    );
  });

  test('changes the selected organisation from the drawer', async ({
    page,
  }) => {
    const drawer = await selectOppilaitosFromTree(page);

    // Listat haetaan uudelle organisaatiolle: hakupyynnön organisaatioOid vaihtuu.
    const searchRequest = page.waitForRequest(
      req =>
        req.url().includes('/kouta-backend/search/koulutukset') &&
        req.url().includes(`organisaatioOid=${OPPILAITOS_OID}`)
    );
    await closeDrawer(drawer);

    await expectSelected(page, OPPILAITOS_OID, 'Organisaatio_1_1');
    await searchRequest;
  });

  // redux-persist: valinta luetaan localStoragesta, kun sivu avataan ilman
  // organisaatioOid-parametria.
  test('keeps the selected organisation across a reload', async ({ page }) => {
    const drawer = await selectOppilaitosFromTree(page);
    await closeDrawer(drawer);
    await expectSelected(page, OPPILAITOS_OID, 'Organisaatio_1_1');

    await page.goto('/kouta/');

    await expectSelected(page, OPPILAITOS_OID, 'Organisaatio_1_1');
  });

  test('keeps favourites and their order across a reload', async ({ page }) => {
    let drawer = await openDrawer(page);
    await searchHierarkia(drawer);
    await treeRow(drawer, 'Organisaatio_1')
      .getByRole('button', { name: 'arrow_drop_down' })
      .click();

    await star(treeRow(drawer, 'Organisaatio_1_1')).click();
    await star(treeRow(drawer, 'Organisaatio_1')).click();

    // Lisäysjärjestys, ei aakkosjärjestys.
    const favourites = drawer.getByTestId('organization-favourites');
    await expect(favourites).toContainText([
      'Organisaatio_1_1',
      'Organisaatio_1',
    ]);

    await page.reload();
    drawer = await openDrawer(page);

    await expect(drawer.getByTestId('organization-favourites')).toContainText([
      'Organisaatio_1_1',
      'Organisaatio_1',
    ]);
  });

  test('selects an organisation from the favourites list', async ({ page }) => {
    const drawer = await openDrawer(page);
    await searchHierarkia(drawer);
    await treeRow(drawer, 'Organisaatio_1')
      .getByRole('button', { name: 'arrow_drop_down' })
      .click();
    await star(treeRow(drawer, 'Organisaatio_1_1')).click();

    await pick(favouriteRow(drawer, 'Organisaatio_1_1'), 'Organisaatio_1_1');
    await closeDrawer(drawer);

    await expectSelected(page, OPPILAITOS_OID, 'Organisaatio_1_1');
  });

  test('removing the selected organisation from favourites keeps the selection', async ({
    page,
  }) => {
    let drawer = await selectOppilaitosFromTree(page);
    await closeDrawer(drawer);
    await expectSelected(page, OPPILAITOS_OID, 'Organisaatio_1_1');

    drawer = await openDrawer(page);
    await searchHierarkia(drawer);
    await treeRow(drawer, 'Organisaatio_1')
      .getByRole('button', { name: 'arrow_drop_down' })
      .click();
    await star(treeRow(drawer, 'Organisaatio_1_1')).click();
    await expect(favouriteRow(drawer, 'Organisaatio_1_1')).toBeVisible();

    await star(favouriteRow(drawer, 'Organisaatio_1_1')).click();
    await expect(drawer.getByTestId('organization-favourites')).toBeHidden();

    await closeDrawer(drawer);
    await expectSelected(page, OPPILAITOS_OID, 'Organisaatio_1_1');
  });

  test('selects an organisation from the root of the tree', async ({
    page,
  }) => {
    const drawer = await openDrawer(page);
    await searchHierarkia(drawer);
    await pick(treeRow(drawer, 'Organisaatio_1'), 'Organisaatio_1');
    await closeDrawer(drawer);

    await expectSelected(page, ROOT_OID, 'Organisaatio_1');
  });
});
