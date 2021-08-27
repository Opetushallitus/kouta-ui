import { getKieletForOppiainevalikoima } from '#/src/utils/hakukohde/getKieletForOppiainevalikoima';

test('map one lukio language with its improved label', () => {
  const lukionKielivalikoima = {
    A1Kielet: ['kieli_en#1'],
  };

  const kielet = [
    {
      value: 'kieli_en#1',
      label: 'englanti',
    },
    {
      value: 'kieli_es#1',
      label: 'espanja',
    },
    {
      value: 'kieli_it#1',
      label: 'italia',
    },
    {
      value: 'kieli_sv#1',
      label: 'ruotsi',
    },
    {
      value: 'kieli_de#1',
      label: 'saksa',
    },
    {
      value: 'kieli_ru#1',
      label: 'venäjä',
    },
    {
      value: 'kieli_et#1',
      label: 'viro',
    },
  ];

  const result = [
    {
      value: 'kieli_en#1',
      label: 'A1 englanti',
    },
  ];

  expect(getKieletForOppiainevalikoima(lukionKielivalikoima, kielet)).toEqual(
    result
  );
});

test('maps languages with their labels', () => {
  const lukionKielivalikoima = {
    A1Kielet: ['kieli_en#1', 'kieli_sv#1'],
    A2Kielet: ['kieli_en#1', 'kieli_sv#1'],
    B1Kielet: ['kieli_sv#1'],
    B2Kielet: ['kieli_de#1'],
    B3Kielet: ['kieli_de#1'],
    aidinkielet: ['kieli_ru#1'],
    muutKielet: ['kieli_et#1'],
  };

  const kielet = [
    {
      value: 'kieli_en#1',
      label: 'englanti',
    },
    {
      value: 'kieli_es#1',
      label: 'espanja',
    },
    {
      value: 'kieli_it#1',
      label: 'italia',
    },
    {
      value: 'kieli_sv#1',
      label: 'ruotsi',
    },
    {
      value: 'kieli_de#1',
      label: 'saksa',
    },
    {
      value: 'kieli_ru#1',
      label: 'venäjä',
    },
    {
      value: 'kieli_et#1',
      label: 'viro',
    },
  ];

  const result = [
    {
      value: 'kieli_en#1',
      label: 'A1 englanti',
    },
    {
      value: 'kieli_sv#1',
      label: 'A1 ruotsi',
    },
    {
      value: 'kieli_en#1',
      label: 'A2 englanti',
    },
    {
      value: 'kieli_sv#1',
      label: 'A2 ruotsi',
    },
    {
      value: 'kieli_sv#1',
      label: 'B1 ruotsi',
    },
    {
      value: 'kieli_de#1',
      label: 'B2 saksa',
    },
    {
      value: 'kieli_de#1',
      label: 'B3 saksa',
    },
    {
      value: 'kieli_ru#1',
      label: 'venäjä',
    },
    {
      value: 'kieli_et#1',
      label: 'viro',
    },
  ];

  expect(getKieletForOppiainevalikoima(lukionKielivalikoima, kielet)).toEqual(
    result
  );
});
