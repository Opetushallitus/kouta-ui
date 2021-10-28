import { getPainotetutOppiaineetOptions } from './usePainotetutOppiaineetOptions';

test('getPaoinotetutOppiaineetOptions', () => {
  const oppiaineetFromKoodisto = [
    {
      value: 'painotettavatoppiaineetlukiossa_a1en#1',
      label: 'A1 englanti',
    },
    {
      value: 'painotettavatoppiaineetlukiossa_a1ru#1',
      label: 'A1 venäjä',
    },
    {
      value: 'painotettavatoppiaineetlukiossa_a2sv#1',
      label: 'A2 ruotsi',
    },
    {
      value: 'painotettavatoppiaineetlukiossa_b1sv#1',
      label: 'B1 ruotsi',
    },
    {
      value: 'painotettavatoppiaineetlukiossa_b1es#1',
      label: 'B1 espanja',
    },
    {
      value: 'painotettavatoppiaineetlukiossa_b2es#1',
      label: 'B2 espanja',
    },
    {
      value: 'painotettavatoppiaineetlukiossa_b3de#1',
      label: 'B3 saksa',
    },
    {
      value: 'painotettavatoppiaineetlukiossa_ai#1',
      label: 'Äidinkieli ja kirjallisuus',
    },
  ];

  const lukionKielivalikoima = {
    A1Kielet: ['kieli_en#1', 'kieli_ru#1'],
    A2Kielet: ['kieli_sv#1'],
    B1Kielet: ['kieli_es#1'],
    B2Kielet: [],
    B3Kielet: ['kieli_de#1'],
    aidinkielet: ['kieli_ru#1'],
    muutKielet: ['kieli_et#1'],
  };

  const result = [
    {
      value: 'painotettavatoppiaineetlukiossa_a1en#1',
      label: 'A1 englanti',
    },
    {
      value: 'painotettavatoppiaineetlukiossa_a1ru#1',
      label: 'A1 venäjä',
    },
    {
      value: 'painotettavatoppiaineetlukiossa_a2sv#1',
      label: 'A2 ruotsi',
    },
    {
      value: 'painotettavatoppiaineetlukiossa_b1es#1',
      label: 'B1 espanja',
    },
    {
      value: 'painotettavatoppiaineetlukiossa_b3de#1',
      label: 'B3 saksa',
    },
    {
      value: 'painotettavatoppiaineetlukiossa_ai#1',
      label: 'Äidinkieli ja kirjallisuus',
    },
  ];

  expect(
    getPainotetutOppiaineetOptions(oppiaineetFromKoodisto, lukionKielivalikoima)
  ).toEqual(result);
});
