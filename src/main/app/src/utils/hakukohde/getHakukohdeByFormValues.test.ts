import { LIITTEEN_TOIMITUSTAPA } from '#/src/constants';
import { HakukohdeFormValues } from '#/src/types/hakukohdeTypes';

import { getHakukohdeByFormValues } from './getHakukohdeByFormValues';
import {
  BASE_HAKUKOHDE_FORMDATA,
  hakukohdeFormValuesWithExtraTranslations,
} from '../testFormData';

test('getHakukohdeByFormValues returns correct hakukohde given form values', () => {
  const hakukohde = getHakukohdeByFormValues(BASE_HAKUKOHDE_FORMDATA);

  expect(hakukohde).toMatchSnapshot();
});

test('getHakukohdeByFormValues does not return translations for non-selected language', () => {
  const hakukohde = getHakukohdeByFormValues(
    hakukohdeFormValuesWithExtraTranslations
  );

  expect(hakukohde).toMatchSnapshot();
});

// Yhteinen toimituspaikka piilottaa liitekohtaiset kentät mutta ei tyhjennä niiden
// arvoja, ja piilotetut arvot palautuvat payloadiin FieldArrayn mukana. Ellei
// tämä funktio nollaa niitä, backend hylkää liitteen jonka oma osoite jäi kesken.
test('getHakukohdeByFormValues drops per-liite toimitustapa when a shared toimituspaikka is in use', () => {
  const [liite] = BASE_HAKUKOHDE_FORMDATA.liitteet!.liitteet!;

  const values = {
    ...BASE_HAKUKOHDE_FORMDATA,
    liitteet: {
      ...BASE_HAKUKOHDE_FORMDATA.liitteet,
      yhteinenToimituspaikka: true,
      liitteet: [
        liite,
        // Toinen liite, jolla toimitustapa on valittu mutta osoite jäänyt täyttämättä:
        // juuri tästä backend valitti, ja vain osasta liitteitä.
        { ...liite, toimitustapa: { tapa: LIITTEEN_TOIMITUSTAPA.MUU_OSOITE } },
      ],
    },
  } as HakukohdeFormValues;

  const hakukohde = getHakukohdeByFormValues(values);

  expect(hakukohde.liitteetOnkoSamaToimitusosoite).toBe(true);
  expect(hakukohde.liitteidenToimitusosoite).not.toBeNull();
  expect(
    hakukohde.liitteet.map(({ toimitustapa, toimitusosoite }) => ({
      toimitustapa,
      toimitusosoite,
    }))
  ).toEqual([
    { toimitustapa: null, toimitusosoite: null },
    { toimitustapa: null, toimitusosoite: null },
  ]);
});

test('getHakukohdeByFormValues keeps per-liite toimitusosoite without a shared toimituspaikka', () => {
  const hakukohde = getHakukohdeByFormValues(BASE_HAKUKOHDE_FORMDATA);

  expect(hakukohde.liitteet[0]!.toimitustapa).toEqual(
    LIITTEEN_TOIMITUSTAPA.MUU_OSOITE
  );
  expect(hakukohde.liitteet[0]!.toimitusosoite).not.toBeNull();
});
