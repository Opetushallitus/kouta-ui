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
