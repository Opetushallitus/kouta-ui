beforeAll(async () => {
  await page.goto(
    'http://localhost:8080/kouta/organisaatio/1.2.246.562.10.594252633210/koulutus',
  );
});

test('should display "Tutkintoon johtava koulutus" text on the page', async () => {
  await expect(page).toMatch('Tutkintoon johtava koulutus', { timeout: 2000 });
});
