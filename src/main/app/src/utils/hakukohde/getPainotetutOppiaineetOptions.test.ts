import {
  getKieletForOppiainevalikoima,
  removeKieletFromKoodistoOppiaineet,
  getPainotetutOppiaineetOptions,
} from '#/src/utils/hakukohde/getPainotetutOppiaineetOptions';

test('map one lukio language with its improved label', () => {
  const lukionKielivalikoima = {
    A1Kielet: ['kieli_en#1'],
  };

  const kielet = [
    {
      value: 'kieli_de#1',
      label: 'saksa',
    },
    {
      value: 'kieli_en#1',
      label: 'englanti',
    },
    {
      value: 'kieli_es#1',
      label: 'espanja',
    },
  ];

  const oppiaineetFromKoodisto = [
    {
      value: 'oppiaineetyleissivistava_a1#1',
      label: 'A1-kieli',
    },
    {
      value: 'oppiaineetyleissivistava_hi#1',
      label: 'Historia',
    },
    {
      value: 'oppiaineetyleissivistava_b22#1',
      label: 'B2-kieli',
    },
  ];

  const result = [
    {
      value: 'A1 englanti',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_a1#1',
        kieli: 'kieli_en#1',
      },
      label: 'A1 englanti',
    },
  ];

  expect(
    getKieletForOppiainevalikoima(
      lukionKielivalikoima,
      kielet,
      oppiaineetFromKoodisto
    )
  ).toEqual(result);
});

test('creates labels for lukiokielet for painotetut arvosanat', () => {
  const lukionKielivalikoima = {
    A1Kielet: ['kieli_en#1', 'kieli_sv#1'],
    A2Kielet: ['kieli_sv#1'],
    B1Kielet: [],
    B2Kielet: ['kieli_de#1'],
    B3Kielet: [],
    aidinkielet: [],
    muutKielet: [],
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
  ];

  const oppiaineetFromKoodisto = [
    {
      value: 'oppiaineetyleissivistava_a1#1',
      label: 'A1-kieli',
    },
    {
      value: 'oppiaineetyleissivistava_a2#1',
      label: 'A2-kieli',
    },
    {
      value: 'oppiaineetyleissivistava_hi#1',
      label: 'Historia',
    },
    {
      value: 'oppiaineetyleissivistava_b22#1',
      label: 'B2-kieli',
    },
  ];

  const result = [
    {
      value: 'A1 englanti',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_a1#1',
        kieli: 'kieli_en#1',
      },
      label: 'A1 englanti',
    },
    {
      value: 'A1 ruotsi',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_a1#1',
        kieli: 'kieli_sv#1',
      },
      label: 'A1 ruotsi',
    },
    {
      value: 'A2 ruotsi',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_a2#1',
        kieli: 'kieli_sv#1',
      },
      label: 'A2 ruotsi',
    },
    {
      value: 'B2 saksa',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_b22#1',
        kieli: 'kieli_de#1',
      },
      label: 'B2 saksa',
    },
  ];

  expect(
    getKieletForOppiainevalikoima(
      lukionKielivalikoima,
      kielet,
      oppiaineetFromKoodisto
    )
  ).toEqual(result);
});

test('leaves out äidinkielet and muut kielet from painotetut arvosanat language selection', () => {
  const lukionKielivalikoima = {
    A1Kielet: ['kieli_en#1'],
    A2Kielet: ['kieli_en#1', 'kieli_sv#1'],
    B1Kielet: ['kieli_sv#1'],
    B2Kielet: ['kieli_de#1'],
    B3Kielet: [],
    aidinkielet: ['kieli_ru#1'],
    muutKielet: ['kieli_et#1'],
  };

  const kielet = [
    {
      value: 'kieli_en#1',
      label: 'englanti',
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
  ];

  const oppiaineetFromKoodisto = [
    {
      value: 'oppiaineetyleissivistava_a1#1',
      label: 'A1-kieli',
    },
    {
      value: 'oppiaineetyleissivistava_a2#1',
      label: 'A2-kieli',
    },
    {
      value: 'oppiaineetyleissivistava_hi#1',
      label: 'Historia',
    },
    {
      value: 'oppiaineetyleissivistava_b22#1',
      label: 'B2-kieli',
    },
    {
      value: 'oppiaineetyleissivistava_b1#1',
      label: 'B1-kieli',
    },
  ];

  const result = [
    {
      value: 'A1 englanti',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_a1#1',
        kieli: 'kieli_en#1',
      },
      label: 'A1 englanti',
    },
    {
      value: 'A2 englanti',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_a2#1',
        kieli: 'kieli_en#1',
      },
      label: 'A2 englanti',
    },
    {
      value: 'A2 ruotsi',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_a2#1',
        kieli: 'kieli_sv#1',
      },
      label: 'A2 ruotsi',
    },
    {
      value: 'B1 ruotsi',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_b1#1',
        kieli: 'kieli_sv#1',
      },
      label: 'B1 ruotsi',
    },
    {
      value: 'B2 saksa',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_b22#1',
        kieli: 'kieli_de#1',
      },
      label: 'B2 saksa',
    },
  ];

  expect(
    getKieletForOppiainevalikoima(
      lukionKielivalikoima,
      kielet,
      oppiaineetFromKoodisto
    )
  ).toEqual(result);
});

test('remove kielet from oppiaineet fetched from koodisto', () => {
  const oppiaineetFromKoodisto = [
    {
      value: 'oppiaineetyleissivistava_a1#1',
      label: 'A1-kieli',
    },
    {
      value: 'oppiaineetyleissivistava_hi#1',
      label: 'Historia',
    },
    {
      value: 'oppiaineetyleissivistava_b22#1',
      label: 'B2-kieli',
    },
  ];

  const result = [
    {
      value: 'Historia',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_hi#1',
      },
      label: 'Historia',
    },
  ];

  expect(removeKieletFromKoodistoOppiaineet(oppiaineetFromKoodisto)).toEqual(
    result
  );
});

test('does not remove Äidinkieli ja kirjallisuus from oppiaineet', () => {
  const oppiaineetFromKoodisto = [
    {
      value: 'oppiaineetyleissivistava_ai#1',
      label: 'Äidinkieli ja kirjallisuus',
    },
    {
      value: 'oppiaineetyleissivistava_b22#1',
      label: 'B2-kieli',
    },
  ];

  const result = [
    {
      value: 'Äidinkieli ja kirjallisuus',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_ai#1',
      },
      label: 'Äidinkieli ja kirjallisuus',
    },
  ];

  expect(removeKieletFromKoodistoOppiaineet(oppiaineetFromKoodisto)).toEqual(
    result
  );
});

test('', () => {
  const oppiaineetFromKoodisto = [
    {
      value: 'oppiaineetyleissivistava_ai#1',
      label: 'Äidinkieli ja kirjallisuus',
    },
    {
      value: 'oppiaineetyleissivistava_a1#1',
      label: 'A1-kieli',
    },
    {
      value: 'oppiaineetyleissivistava_a2#1',
      label: 'A2-kieli',
    },
    {
      value: 'oppiaineetyleissivistava_b12#1',
      label: 'B1-kieli',
    },
    {
      value: 'oppiaineetyleissivistava_b22#1',
      label: 'B2-kieli',
    },
    {
      value: 'oppiaineetyleissivistava_b3#1',
      label: 'B3-kieli',
    },
  ];

  const kieletFromKoodisto = [
    {
      value: 'kieli_en#1',
      label: 'englanti',
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
  ];

  const lukionKielivalikoima = {
    A1Kielet: ['kieli_en#1', 'kieli_ru#1'],
    A2Kielet: ['kieli_sv#1'],
    B1Kielet: ['kieli_sv#1'],
    B2Kielet: [],
    B3Kielet: ['kieli_de#1'],
    aidinkielet: ['kieli_ru#1'],
    muutKielet: ['kieli_et#1'],
  };

  const result = [
    {
      value: 'A1 englanti',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_a1#1',
        kieli: 'kieli_en#1',
      },
      label: 'A1 englanti',
    },
    {
      value: 'A1 venäjä',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_a1#1',
        kieli: 'kieli_ru#1',
      },
      label: 'A1 venäjä',
    },
    {
      value: 'A2 ruotsi',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_a2#1',
        kieli: 'kieli_sv#1',
      },
      label: 'A2 ruotsi',
    },
    {
      value: 'B1 ruotsi',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_b12#1',
        kieli: 'kieli_sv#1',
      },
      label: 'B1 ruotsi',
    },
    {
      value: 'B3 saksa',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_b3#1',
        kieli: 'kieli_de#1',
      },
      label: 'B3 saksa',
    },
    {
      value: 'Äidinkieli ja kirjallisuus',
      koodiUrit: {
        oppiaine: 'oppiaineetyleissivistava_ai#1',
      },
      label: 'Äidinkieli ja kirjallisuus',
    },
  ];

  expect(
    getPainotetutOppiaineetOptions(
      oppiaineetFromKoodisto,
      kieletFromKoodisto,
      lukionKielivalikoima
    )
  ).toEqual(result);
});
