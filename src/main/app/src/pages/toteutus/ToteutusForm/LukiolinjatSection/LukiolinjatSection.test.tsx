import { renderHook } from '@testing-library/react-hooks';

import { useLukioToteutusNimi } from './LukiolinjatSection';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str, { lng }) => `${str}/${lng}`,
  }),
}));

test('useLukioToteutusNimi should return right name with all arguments', () => {
  const { result } = renderHook(() =>
    useLukioToteutusNimi({
      yleislinjaSelected: true,
      selectedLinjatTranslations: [
        { fi: 'Painotus 1 fi', sv: 'Painotus 1 sv', en: 'Painotus 1 en' },
        { fi: 'Painotus 2 fi', sv: 'Painotus 2 sv', en: 'Painotus 2 en' },
      ],
      opintojenLaajuusNumero: 150,
    })
  );

  expect(result.current).toEqual({
    fi:
      'toteutuslomake.lukionYleislinja/fi, 150 yleiset.opintopistetta/fi, Painotus 1 fi, 150 yleiset.opintopistetta/fi, Painotus 2 fi, 150 yleiset.opintopistetta/fi',
    sv:
      'toteutuslomake.lukionYleislinja/sv, 150 yleiset.opintopistetta/sv, Painotus 1 sv, 150 yleiset.opintopistetta/sv, Painotus 2 sv, 150 yleiset.opintopistetta/sv',
    en:
      'toteutuslomake.lukionYleislinja/en, 150 yleiset.opintopistetta/en, Painotus 1 en, 150 yleiset.opintopistetta/en, Painotus 2 en, 150 yleiset.opintopistetta/en',
  });
});

test('useLukioToteutusNimi should return right name without yleislinja', () => {
  const { result } = renderHook(() =>
    useLukioToteutusNimi({
      yleislinjaSelected: false,
      selectedLinjatTranslations: [
        { fi: 'Painotus 1 fi', sv: 'Painotus 1 sv', en: 'Painotus 1 en' },
        { fi: 'Painotus 2 fi', sv: 'Painotus 2 sv', en: 'Painotus 2 en' },
      ],
      opintojenLaajuusNumero: 150,
    })
  );

  expect(result.current).toEqual({
    fi:
      'Painotus 1 fi, 150 yleiset.opintopistetta/fi, Painotus 2 fi, 150 yleiset.opintopistetta/fi',
    sv:
      'Painotus 1 sv, 150 yleiset.opintopistetta/sv, Painotus 2 sv, 150 yleiset.opintopistetta/sv',
    en:
      'Painotus 1 en, 150 yleiset.opintopistetta/en, Painotus 2 en, 150 yleiset.opintopistetta/en',
  });
});

test('useLukioToteutusNimi should return right name without yleislinja', () => {
  const { result } = renderHook(() =>
    useLukioToteutusNimi({
      yleislinjaSelected: true,
      selectedLinjatTranslations: [],
      opintojenLaajuusNumero: 150,
    })
  );

  expect(result.current).toEqual({
    fi: 'toteutuslomake.lukionYleislinja/fi, 150 yleiset.opintopistetta/fi',
    sv: 'toteutuslomake.lukionYleislinja/sv, 150 yleiset.opintopistetta/sv',
    en: 'toteutuslomake.lukionYleislinja/en, 150 yleiset.opintopistetta/en',
  });
});

test('useLukioToteutusNimi should return empty names with only laajuus given', () => {
  const { result } = renderHook(() =>
    useLukioToteutusNimi({
      yleislinjaSelected: false,
      selectedLinjatTranslations: [],
      opintojenLaajuusNumero: 150,
    })
  );

  expect(result.current).toEqual({
    fi: null,
    sv: null,
    en: null,
  });
});

test('useLukioToteutusNimi should not try to create nimi when translations are missing ', () => {
  const { result } = renderHook(() =>
    useLukioToteutusNimi({
      yleislinjaSelected: true,
      selectedLinjatTranslations: [
        { fi: 'Painotus 1 fi', sv: 'Painotus 1 sv' },
        { fi: 'Painotus 2 fi', sv: 'Painotus 2 sv' },
      ],
      opintojenLaajuusNumero: 150,
    })
  );

  expect(result.current).toEqual({
    en: undefined,
    fi:
      'toteutuslomake.lukionYleislinja/fi, 150 yleiset.opintopistetta/fi, Painotus 1 fi, 150 yleiset.opintopistetta/fi, Painotus 2 fi, 150 yleiset.opintopistetta/fi',
    sv:
      'toteutuslomake.lukionYleislinja/sv, 150 yleiset.opintopistetta/sv, Painotus 1 sv, 150 yleiset.opintopistetta/sv, Painotus 2 sv, 150 yleiset.opintopistetta/sv',
  });
});
