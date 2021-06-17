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
      'hakukohdelomake.lukionYleislinja/fi, Painotus 1 fi, Painotus 2 fi, 150 yleiset.opintopistetta/fi',
    sv:
      'hakukohdelomake.lukionYleislinja/sv, Painotus 1 sv, Painotus 2 sv, 150 yleiset.opintopistetta/sv',
    en:
      'hakukohdelomake.lukionYleislinja/en, Painotus 1 en, Painotus 2 en, 150 yleiset.opintopistetta/en',
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
    fi: 'Painotus 1 fi, Painotus 2 fi, 150 yleiset.opintopistetta/fi',
    sv: 'Painotus 1 sv, Painotus 2 sv, 150 yleiset.opintopistetta/sv',
    en: 'Painotus 1 en, Painotus 2 en, 150 yleiset.opintopistetta/en',
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
    fi: 'hakukohdelomake.lukionYleislinja/fi, 150 yleiset.opintopistetta/fi',
    sv: 'hakukohdelomake.lukionYleislinja/sv, 150 yleiset.opintopistetta/sv',
    en: 'hakukohdelomake.lukionYleislinja/en, 150 yleiset.opintopistetta/en',
  });
});

test('useLukioToteutusNimi should return right name without yleislinja', () => {
  const { result } = renderHook(() =>
    useLukioToteutusNimi({
      yleislinjaSelected: false,
      selectedLinjatTranslations: [],
      opintojenLaajuusNumero: 150,
    })
  );

  expect(result.current).toEqual({
    fi: undefined,
    sv: undefined,
    en: undefined,
  });
});

test('useLukioToteutusNimi should return right name without yleislinja', () => {
  const { result } = renderHook(() =>
    useLukioToteutusNimi({
      yleislinjaSelected: false,
      selectedLinjatTranslations: [],
      opintojenLaajuusNumero: undefined,
    })
  );

  expect(result.current).toEqual({
    fi: undefined,
    sv: undefined,
    en: undefined,
  });
});
