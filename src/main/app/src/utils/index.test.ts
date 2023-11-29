import {
  getFieldNameWithoutLanguage,
  getValuesForSaving,
  isDeepEmptyFormValues,
  formatDateValue,
  maybeParseNumber,
  parseBooleanToString,
  parseStringToBoolean,
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

test('parses decimal with comma', () => {
  expect(maybeParseNumber('5,8')).toEqual(5.8);
});

test('does not convert text to number', () => {
  expect(maybeParseNumber('a')).toEqual('a');
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
  [
    { nimet: [{ nimi: { fi: '' } }] },
    {
      'nimet[0].nimi.fi': { name: 'nimet[0].nimi.fi' },
      nimet: { name: 'nimet' },
    },
    {},
    {},
    { nimet: [{ nimi: {} }] },
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

test('parseBooleanToString parses null and undefined values to undefined', () => {
  expect(parseBooleanToString(null)).toBe(undefined);
  expect(parseBooleanToString(undefined)).toBe(undefined);
  expect(parseBooleanToString('')).toBe(undefined);
  expect(parseBooleanToString(true)).toBe('true');
  expect(parseBooleanToString(false)).toBe('false');
});

test('parseStringToBoolen is undefined when value not given or invalid', () => {
  expect(parseStringToBoolean(null)).toBe(undefined);
  expect(parseStringToBoolean(undefined)).toBe(undefined);
  expect(parseStringToBoolean('')).toBe(undefined);
  expect(parseStringToBoolean('foo')).toBe(undefined);
  expect(parseStringToBoolean('true')).toBe(true);
  expect(parseStringToBoolean('false')).toBe(false);
});
