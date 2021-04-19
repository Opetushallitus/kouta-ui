import {
  getFieldName,
  getValuesForSaving,
  isDeepEmptyFormValues,
  formatDateValue,
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
  expect(getFieldName(name)).toEqual(fieldName);
});

test.each([
  ['2020-01-01T00:00', '01.01.2020 00:00'],
  [null, null],
  ['2020-01-01', '01.01.2020 00:00'],
])('formatDateValue', (dateString, result) => {
  expect(formatDateValue(dateString)).toEqual(result);
});
