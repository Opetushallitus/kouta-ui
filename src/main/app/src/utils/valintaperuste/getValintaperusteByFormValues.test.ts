import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import { getValintaperusteByFormValues } from '#/src/utils/valintaperuste/getValintaperusteByFormValues';

import {
  BASE_VALINTAPERUSTE_FORM_DATA,
  valintakokeetWithExtraTranslations,
  valintatapa,
  valintatapaWithExtraTranslations,
} from '../testFormData';

test('Should convert valintaperuste form with valintatapa', () => {
  const data = {
    ...BASE_VALINTAPERUSTE_FORM_DATA,
    valintatavat: [valintatapa],
  };

  const valintaperuste = getValintaperusteByFormValues(data);

  expect(valintaperuste).toMatchSnapshot();
});

test('Should not convert translations for non-selected language', () => {
  const data = {
    ...BASE_VALINTAPERUSTE_FORM_DATA,
    valintatavat: [valintatapaWithExtraTranslations],
    valintakokeet: valintakokeetWithExtraTranslations,
  };

  const valintaperuste = getValintaperusteByFormValues(data);

  expect(valintaperuste).toMatchSnapshot();
});

test('Should convert valintaperuste form without valintatapa', () => {
  const valintaperuste = getValintaperusteByFormValues({
    ...BASE_VALINTAPERUSTE_FORM_DATA,
    valintatavat: [{}],
  });

  expect(valintaperuste).toMatchSnapshot();
});
