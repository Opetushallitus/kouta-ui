import _fp from 'lodash/fp';
import { Ajankohtatyyppi, Alkamiskausityyppi } from '#/src/constants';

export const alkamiskausityyppiToAjankohtatyyppi = _fp.cond([
  [
    _fp.overSome([
      _fp.isEqual(Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI),
      _fp.isEqual(Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA),
    ]),
    () => Ajankohtatyyppi.ALKAMISKAUSI,
  ],
  [
    _fp.isEqual(Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA),
    () => Ajankohtatyyppi.HENKILOKOHTAINEN_SUUNNITELMA,
  ],
]);

const ajankohtaEquals = ajankohta => ajankohtaSection =>
  ajankohtaSection?.ajankohtaTyyppi === ajankohta;

const hasTarkkaAjankohta = ajankohtaSection =>
  ajankohtaSection?.tiedossaTarkkaAjankohta;

export const getAlkamiskausityyppiByAjankohtaSection = _fp.cond([
  [
    ajankohtaEquals(Ajankohtatyyppi.ALKAMISKAUSI),
    _fp.cond([
      [hasTarkkaAjankohta, () => Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA],
      [_fp.T, () => Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI],
    ]),
  ],
  [
    ajankohtaEquals(Ajankohtatyyppi.HENKILOKOHTAINEN_SUUNNITELMA),
    () => Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA,
  ],
  [_fp.T, () => null],
]);
