import { Page, expect, test } from '@playwright/test';
import { merge } from 'lodash';

import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

import organisaatio from './fixtures/organisaatio';
import { fixtureJSON, mocksFromFile } from './playwright-utils';

const oid = OPETUSHALLITUS_ORGANISAATIO_OID;

const kayttoOikeusOmatTiedotFixture = (
  organisaatiot?: Array<{
    organisaatioOid: string;
    kayttooikeudet: Array<{ palvelu: 'KOUTA'; oikeus: string }>;
  }>
): Serializable => ({
  oidHenkilo: '1.2.246.562.24.62301161440',
  username: 'johndoe',
  kayttajaTyyppi: 'VIRKAILIJA',
  organisaatiot: organisaatiot ?? [
    {
      organisaatioOid: '1.2.246.562.10.00000000001',
      kayttooikeudet: [
        {
          palvelu: 'KOUTA',
          oikeus: 'OPHPAAKAYTTAJA',
        },
      ],
    },
  ],
  isAdmin: true,
  isMiniAdmin: true,
  anomusilmoitus: [],
  mfaProvider: null,
});

const koutaSearchItem = ({ idProp = 'oid' } = { idProp: 'oid' }) => ({
  modified: '2019-02-20T07:55',
  muokkaaja: { nimi: 'John Doe', oid: '1.2.246.562.24.62301161440' },
  nimi: { fi: 'Nimi' },
  [idProp]: '1.1.1.1.1.1',
  organisaatio: {},
  tila: 'tallennettu',
});

const stubCommonRoutes = async (page: Page) => {
  await page.route('**/lokalisointi/cxf/rest/v1/localisation', fixtureJSON([]));
  await page.route(
    '**/kayttooikeus-service/henkilo/current/omattiedot',
    fixtureJSON(kayttoOikeusOmatTiedotFixture())
  );
  await page.route(
    '**/oppijanumerorekisteri-service/henkilo/current/asiointiKieli',
    route =>
      route.fulfill({
        body: 'fi',
        contentType: 'text/plain',
      })
  );
  await page.route('**/kouta-backend/auth/session', fixtureJSON({}));
  await page.route('**/kouta-backend/auth/login', fixtureJSON({}));
  await mocksFromFile(page, 'common.mocks.json');
};

const stubMyOrganizations = async (page: Page) => {
  await page.route(
    '**/kouta-backend/organisaatio/organisaatiot',
    fixtureJSON([
      merge(organisaatio(), {
        oid,
        nimi: {
          fi: 'Organisaatio_1',
        },
      }),
    ])
  );

  await page.route(
    '**/kayttooikeus-service/organisaatiohenkilo/organisaatioOid',
    fixtureJSON([oid])
  );

  await page.route(
    '**/kouta-backend/search/koulutukset?*',
    fixtureJSON({
      totalCount: 1,
      result: [
        merge(koutaSearchItem(), {
          nimi: { fi: 'Koulutuksen nimi' },
          tila: 'julkaistu',
        }),
      ],
    })
  );

  await page.route(
    '**/kouta-backend/search/toteutukset?*',
    fixtureJSON({
      totalCount: 1,
      result: [
        merge(koutaSearchItem(), {
          nimi: { fi: 'Toteutuksen nimi' },
          tila: 'julkaistu',
        }),
      ],
    })
  );

  await page.route(
    '**/kouta-backend/search/haut?*',
    fixtureJSON({
      totalCount: 1,
      result: [
        merge(koutaSearchItem(), {
          nimi: { fi: 'Haun nimi' },
          tila: 'julkaistu',
        }),
      ],
    })
  );

  await page.route(
    '**/kouta-backend/search/hakukohteet?*',
    fixtureJSON({
      totalCount: 1,
      result: [
        merge(koutaSearchItem(), {
          nimi: { fi: 'Hakukohteen nimi' },
          tila: 'julkaistu',
        }),
      ],
    })
  );

  await page.route(
    '**/kouta-backend/search/valintaperusteet?*',
    fixtureJSON({
      totalCount: 1,
      result: [
        merge(koutaSearchItem(), {
          nimi: { fi: 'Valintaperusteen nimi' },
          tila: 'julkaistu',
        }),
      ],
    })
  );

  await page.route('**/koodi?onlyValidKoodis=true', fixtureJSON({}));
  await page.route('**/kouta-backend/**/list*', fixtureJSON([]));
};

test.describe('frontPage', () => {
  test.beforeEach(async ({ page }) => {
    await stubCommonRoutes(page);
    await stubMyOrganizations(page);
    await page.goto('/kouta');
  });

  test('Should display organization hierarchy', async ({ page }) => {
    await page.getByTestId('toggleOrganisaatioDrawer').click();

    await expect(page.getByTestId('selectedOrganisaatio')).toContainText(
      'Organisaatio_1'
    );
    await expect(page.getByTestId('organisaatioDrawer')).toContainText(
      'etusivu.vaihdaOrganisaatiota'
    );
  });

  test('Should add organization to favourites', async ({ page }) => {
    await page.getByTestId('toggleOrganisaatioDrawer').click();
    const drawer = page.getByTestId('organisaatioDrawer');

    await expect(drawer.getByTestId('organization-favourites')).toBeHidden();
    await drawer.getByTitle('etusivu.lisaaSuosikkeihin').first().click();
    await expect(drawer.getByTestId('organization-favourites')).toBeVisible();
  });

  test('Should remove organization from favourites', async ({ page }) => {
    await page.getByTestId('toggleOrganisaatioDrawer').click();
    const drawer = page.getByTestId('organisaatioDrawer');
    await drawer.getByTitle('etusivu.lisaaSuosikkeihin').first().click();
    await drawer
      .getByTestId('organization-favourites')
      .getByRole('button')
      .first()
      .click();
    await expect(drawer.getByTestId('organization-favourites')).toBeHidden();
  });

  test('Should display navigation links', async ({ page }) => {
    const nav = page.getByTestId('navigaatio');
    await expect(nav).toContainText('yleiset.koulutukset');
    await expect(nav).toContainText('yleiset.toteutukset');
    await expect(nav).toContainText('yleiset.haut');
    await expect(nav).toContainText('yleiset.hakukohteet');
    await expect(nav).toContainText('yleiset.valintaperusteet');
  });

  test('Should list entities', async ({ page }) => {
    await expect(page.getByTestId('koulutusTable')).toContainText(
      'Koulutuksen nimi'
    );
    await expect(page.getByTestId('toteutusTable')).toContainText(
      'Toteutuksen nimi'
    );
    await expect(page.getByTestId('hakuTable')).toContainText('Haun nimi');
    await expect(page.getByTestId('hakukohdeTable')).toContainText(
      'Hakukohteen nimi'
    );
    await expect(page.getByTestId('valintaperusteTable')).toContainText(
      'Valintaperusteen nimi'
    );
  });
});
