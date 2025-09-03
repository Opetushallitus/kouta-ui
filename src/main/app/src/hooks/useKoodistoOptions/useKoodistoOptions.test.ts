import { renderHook } from '@testing-library/react';

import { useKoodistoDataOptions } from './index';

test('useKoodistoDataOptions should return array of select options sorted by label for simple koodisto', () => {
  const { result } = renderHook(() =>
    useKoodistoDataOptions({
      koodistoData: [
        {
          koodiUri: 'jokukoodisto_0',
          versio: 1,
          metadata: [
            {
              kieli: 'FI',
              nimi: 'x fi',
            },
            {
              kieli: 'SV',
              nimi: 'x sv',
            },
          ],
        },
        {
          koodiUri: 'jokukoodisto_1',
          versio: 1,
          metadata: [
            {
              kieli: 'FI',
              nimi: 'a fi',
            },
            {
              kieli: 'SV',
              nimi: 'a sv',
            },
          ],
        },
      ],
      language: 'fi',
    })
  );

  expect(result.current).toEqual([
    {
      value: 'jokukoodisto_1#1',
      label: 'a fi',
    },
    {
      value: 'jokukoodisto_0#1',
      label: 'x fi',
    },
  ]);
});

test('useKoodistoDataOptions should return empty array when koodistoData is empty array', () => {
  const { result } = renderHook(() =>
    useKoodistoDataOptions({
      koodistoData: [],
      language: 'fi',
    })
  );

  expect(result.current).toEqual([]);
});
