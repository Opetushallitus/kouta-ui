import { Page, expect, test } from '@playwright/test';

import {
  typeToEditor,
  withinSection,
  fillKieliversiotSection,
  fillKoulutustyyppiSection,
  fillOrgSection,
  fillTilaSection,
  tallenna,
} from '#/playwright/playwright-helpers';
import { stubSoraKuvausRoutes } from '#/playwright/stubSoraKuvausRoutes';

const organisaatioOid = '1.1.1.1.1.1';

const fillTiedotSection = async (page: Page) =>
  withinSection(page, 'tiedot', async section => {
    await typeToEditor(section.getByTestId('kuvaus'), 'Kuvaus');
  });

// Tallennusvirhe katoaa kentältä ensimmäisellä näppäinpainalluksella.
//
// redux-formilla virhe poistui, koska sen CHANGE-reducer siivosi submitErrorsin.
// react-final-formissa submitError säilyy seuraavaan tallennukseen asti, joten
// wrapper piilottaa sen kentän meta.modifiedSinceLastSubmitin perusteella
// (formFields/Field.tsx). Ilman sitä punainen reunus jäisi ristiriidassa syötteen
// kanssa siihen asti että käyttäjä painaa Tallenna uudelleen.
test.describe('Submit error clearing', () => {
  test.beforeEach(async ({ page }) => {
    await stubSoraKuvausRoutes(page, organisaatioOid);
    await page.goto(
      `/kouta/organisaatio/${organisaatioOid}/sora-kuvaus/kielivalinnat/`
    );
  });

  test('error clears on first keystroke after a failed save', async ({
    page,
  }) => {
    await fillOrgSection(page, organisaatioOid);
    await fillKoulutustyyppiSection(page, ['amm']);
    await fillKieliversiotSection(page);
    await fillTiedotSection(page);
    await fillTilaSection(page);
    await tallenna(page);

    const control = page.getByTestId('form-control_tiedot.nimi');
    const error = control.getByText('validointivirheet.pakollisetKaannokset');
    await expect(error).toBeVisible();

    // Yksi merkki riittää: redux-formilla virhe katosi ensimmäisellä
    // näppäinpainalluksella.
    await control.getByRole('textbox').first().pressSequentially('a');
    await expect(error).toBeHidden();
  });
});
