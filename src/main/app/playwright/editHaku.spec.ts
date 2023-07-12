import { test, expect } from '@playwright/test';
import { sub } from 'date-fns';
import { merge } from 'lodash';

import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

import haku from './mocks/haku';
import { fixtureJSON } from './mocks/playwright-mock-utils';
import { stubHakuRoutes } from './mocks/stubHakuRoutes';
import { stubKayttoOikeusOmatTiedot } from './mocks/stubKayttoOikeusOmatTiedot';
import {
  assertNoUnsavedChangesDialog,
  assertURLEndsWith,
  confirmDelete,
  fillKieliversiotSection,
  fillTilaSection,
  setFakeTime,
  tallenna,
  wrapMutationTest,
} from './playwright-helpers';

const mutationTest = wrapMutationTest(ENTITY.HAKU);

const organisaatioOid = '1.1.1.1.1.1';
const hakuOid = '2.1.1.1.1.1';

test.describe('Edit haku', () => {
  test.beforeEach(async ({ page }) => {
    await stubHakuRoutes(page, organisaatioOid);

    page.route(
      `**/kouta-backend/haku/${hakuOid}`,
      fixtureJSON(
        merge(haku(), {
          oid: hakuOid,
          organisaatioOid: organisaatioOid,
        })
      )
    );
    await page.goto(
      `/kouta/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`
    );
  });

  test('Should be able to edit haku', async ({ page }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await fillKieliversiotSection(page);
      await tallenna(page);
    }));

  test('Should be able to delete haku', async ({ page }, testInfo) =>
    await mutationTest({ page, testInfo }, async () => {
      await fillKieliversiotSection(page);
      await fillTilaSection(page, 'poistettu');
      await tallenna(page);
      await confirmDelete(page);
    }));

  test("Shouldn't complain about unsaved changes for untouched form", async ({
    page,
  }) => {
    await assertNoUnsavedChangesDialog(page);
  });

  test('Should redirect from url without organization', async ({ page }) => {
    page.goto(`/kouta/haku/${hakuOid}/muokkaus`);
    await assertURLEndsWith(
      page,
      `/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/haku/${hakuOid}/muokkaus`
    );
  });

  test('should not be possible for oppilaitos user to add hakukohde for haku with expired liittämistakaraja', async ({
    page,
  }) => {
    await stubKayttoOikeusOmatTiedot(page, [
      {
        organisaatioOid,
        kayttooikeudet: [
          {
            palvelu: 'KOUTA',
            oikeus: 'HAKU_CRUD',
          },
        ],
      },
    ]);

    await page.goto(
      `/kouta/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`
    );
    await expect(
      page.getByRole('button', { name: 'yleiset.liitaHakukohde' })
    ).toBeDisabled();
  });

  test('should be possible for OPH virkailija to add hakukohde for haku with expired liittämistakaraja', async ({
    page,
  }) => {
    await expect(
      page.getByRole('button', { name: 'yleiset.liitaHakukohde' })
    ).toBeEnabled();
  });

  test('should be possible for oppilaitos user to add hakukohde for haku without expired liittämistakaraja', async ({
    page,
  }) => {
    const hakuMockData = haku();
    const takaraja = hakuMockData.hakukohteenLiittamisenTakaraja;
    const oneDayBeforeDeadline = sub(new Date(takaraja), { days: 1 });
    await setFakeTime(page, oneDayBeforeDeadline);
    await stubKayttoOikeusOmatTiedot(page, [
      {
        organisaatioOid,
        kayttooikeudet: [
          {
            palvelu: 'KOUTA',
            oikeus: 'HAKU_CRUD',
          },
        ],
      },
    ]);

    await page.route(
      `**/kouta-backend/haku/${hakuOid}`,
      fixtureJSON(
        merge(hakuMockData, {
          oid: hakuOid,
          organisaatioOid: organisaatioOid,
        })
      )
    );

    await page.goto(
      `/kouta/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`
    );
    await expect(
      page.getByRole('button', { name: 'yleiset.liitaHakukohde' })
    ).toBeEnabled();
  });
});
