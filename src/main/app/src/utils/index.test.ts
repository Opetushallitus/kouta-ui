import {
  getFieldNameWithoutLanguage,
  getValuesForSaving,
  isDeepEmptyFormValues,
  formatDateValue,
  parseOpintojenLaajuusRange,
  getOpintojenLaajuusRange,
} from '#/src/utils';

const OBJECT_IN_ARRAY = [
  {
    kuvaus: {},
    nimi: {},
    valintatapaKoodiUri: null,
    sisalto: [],
    kaytaMuuntotaulukkoa: null,
    kynnysehto: {},
    enimmaispisteet: null,
    vahimmaispisteet: null,
  },
];

const NOT_EMPTY_ARRAY = [1];

const NOT_EMPTY_OBJECT = {
  key: 'value',
};

const EMTPY_STRING_VALUE_OBJECT = {
  value: '',
};

const EMTPY_VALUE_OBJECT = {
  value: undefined,
};

test('Should return true for object with empty values in array', () => {
  expect(isDeepEmptyFormValues(OBJECT_IN_ARRAY)).toEqual(true);
});

test('Should return true for object with key "value", but undefined', () => {
  expect(isDeepEmptyFormValues(EMTPY_VALUE_OBJECT)).toEqual(true);
});

test('Should return true for object with key "value", but empty string', () => {
  expect(isDeepEmptyFormValues(EMTPY_STRING_VALUE_OBJECT)).toEqual(true);
});

test('Should return true for empty object', () => {
  expect(isDeepEmptyFormValues({})).toEqual(true);
});

test('Should return false for not empty array', () => {
  expect(isDeepEmptyFormValues(NOT_EMPTY_ARRAY)).toEqual(false);
});

test('Should return false for not empty object', () => {
  expect(isDeepEmptyFormValues(NOT_EMPTY_OBJECT)).toEqual(false);
});

test('Should return false for zero', () => {
  expect(isDeepEmptyFormValues(0)).toEqual(false);
});

test.each([
  [
    {
      nimi: {
        fi: 'nimi fi',
        sv: 'nimi sv',
      },
    },
    {},
    {
      'nimi.fi': { name: 'nimi.fi' },
      'nimi.sv': { name: 'nimi.sv' },
    },
    {},
    {
      nimi: null,
    },
  ],
  [
    {
      nimi: {
        fi: 'nimi fi',
        sv: 'nimi sv',
      },
    },
    {
      'nimi.fi': { name: 'nimi.fi' },
      'nimi.sv': { name: 'nimi.sv' },
    },
    {
      'nimi.fi': { name: 'nimi.fi' },
    },
    {},
    {
      nimi: {
        fi: 'nimi fi',
        sv: 'nimi sv',
      },
    },
  ],
  [
    {
      nimi: {
        fi: 'nimi fi',
        sv: 'nimi sv',
      },
    },
    {
      'nimi.fi': { name: 'nimi.fi' },
    },
    {
      'nimi.fi': { name: 'nimi.fi' },
      'nimi.sv': { name: 'nimi.sv' },
    },
    {},
    {
      nimi: {
        fi: 'nimi fi',
        sv: 'nimi sv',
      },
    },
  ],
  [
    {
      nimi: {
        fi: 'nimi fi',
        sv: 'nimi sv',
      },
    },
    {
      'nimi.fi': { name: 'nimi.fi' },
    },
    {
      'nimi.sv': { name: 'nimi.sv' },
    },
    {},
    {
      nimi: {
        fi: 'nimi fi',
        sv: 'nimi sv',
      },
    },
  ],
])(
  'getValuesForSaving',
  (values, registeredFields, unregisteredFields, initialValues, result) => {
    expect(
      getValuesForSaving(
        values,
        registeredFields,
        unregisteredFields,
        initialValues
      )
    ).toEqual(result);
  }
);

test.each([
  ['nimi.fi', 'nimi'],
  ['nimi', 'nimi'],
  ['perustiedot.nimi', 'perustiedot.nimi'],
])('getFieldName', (name, fieldName) => {
  expect(getFieldNameWithoutLanguage(name)).toEqual(fieldName);
});

test.each([
  ['2020-01-01T00:00', '01.01.2020 00:00'],
  [null, null],
  ['2020-01-01', '01.01.2020 00:00'],
])('formatDateValue', (dateString, result) => {
  expect(formatDateValue(dateString)).toEqual(result);
});

test('Should parse number from a string with one number', () => {
  expect(parseOpintojenLaajuusRange('5')).toEqual({ min: 5, max: undefined });
});

test('Should parse min and max numbers from a string with range', () => {
  expect(parseOpintojenLaajuusRange('5 - 10')).toEqual({ min: 5, max: 10 });
});

test('Should parse min and max numbers from a string with range without whitespace', () => {
  expect(parseOpintojenLaajuusRange('5 - 10')).toEqual({ min: 5, max: 10 });
});

test('Should set max laajuus as NaN if there are other chars for it than numbers', () => {
  expect(parseOpintojenLaajuusRange('5 - 10xyz5')).toEqual({
    min: 5,
    max: NaN,
  });
});

test('Should set min laajuus as NaN if there are other chars for it than numbers', () => {
  expect(parseOpintojenLaajuusRange('xyz35 - 10')).toEqual({
    min: NaN,
    max: 10,
  });
});

test('Should set min laajuus as NaN because string cannot be parsed as single number', () => {
  expect(parseOpintojenLaajuusRange('xyz35')).toEqual({
    min: NaN,
    max: undefined,
  });
});

test('Should set min laajuus as undefined if opintojenlaajuus range not defined', () => {
  expect(parseOpintojenLaajuusRange(undefined)).toEqual({
    min: undefined,
    max: undefined,
  });
});

test('Should form range string from min opintojenlaajuus', () => {
  expect(getOpintojenLaajuusRange(5)).toEqual('5');
});

test('Should form range string from min and max opintojenlaajuus numbers', () => {
  expect(getOpintojenLaajuusRange(5, 15)).toEqual('5 - 15');
});

test('Should form range string from max opintojenlaajuus', () => {
  expect(getOpintojenLaajuusRange(null, 15)).toEqual('15');
});
