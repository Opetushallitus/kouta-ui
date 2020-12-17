import { Alkamiskausityyppi, Ajankohtatyyppi } from '#/src/constants';
import {
  alkamiskausityyppiToAjankohtatyyppi,
  getAlkamiskausityyppiByAjankohtaSection,
} from './alkamiskausityyppiHelpers';

test.each([
  [Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI, Ajankohtatyyppi.ALKAMISKAUSI],
  [Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA, Ajankohtatyyppi.ALKAMISKAUSI],
  [
    Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA,
    Ajankohtatyyppi.HENKILOKOHTAINEN_SUUNNITELMA,
  ],
])(
  'alkamiskausityyppiToAjankohtaTyyppi',
  (alkamiskausityyppi, ajankohtatyyppi) => {
    expect(alkamiskausityyppiToAjankohtatyyppi(alkamiskausityyppi)).toEqual(
      ajankohtatyyppi
    );
  }
);

test.each([
  [
    {
      ajankohtaTyyppi: Ajankohtatyyppi.ALKAMISKAUSI,
      tiedossaTarkkaAjankohta: true,
    },
    Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA,
  ],
  [
    {
      ajankohtaTyyppi: Ajankohtatyyppi.ALKAMISKAUSI,
      tiedossaTarkkaAjankohta: false,
    },
    Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI,
  ],
  [
    {
      ajankohtaTyyppi: Ajankohtatyyppi.HENKILOKOHTAINEN_SUUNNITELMA,
    },
    Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA,
  ],
])(
  'getAlkamiskausityyppiByAjankohtaSection',
  (ajankohtaSection, alkamiskausityyppi) => {
    expect(getAlkamiskausityyppiByAjankohtaSection(ajankohtaSection)).toEqual(
      alkamiskausityyppi
    );
  }
);
