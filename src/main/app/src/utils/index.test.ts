import {
  getFieldNameWithoutLanguage,
  getValuesForSaving,
  isDeepEmptyFormValues,
  formatDateValue,
  maybeParseNumber,
  parseBooleanToString,
  parseStringToBoolean,
  getTermsByLanguage,
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

const registered = (...names: Array<string>) =>
  Object.fromEntries(names.map(name => [name, { name }]));

/**
 * Karakterisointitestit getValuesForSaving-funktiolle.
 *
 * Tallennettava payload muodostuu siitä, mitkä kentät ovat sillä hetkellä
 * REKISTERÖITYINÄ (eli renderöityinä), ei lomakkeen arvoista: jokainen
 * rekisteröity polku kirjoitetaan, ja jokainen rekisteröimätön polku (käyttäjän
 * piilottama kenttä) asetetaan eksplisiittisesti nulliksi. Nämä testit
 * lukitsevat nykyisen toiminnan, jottei redux-formista react-final-formiin
 * siirtyminen voi muuttaa sitä huomaamatta.
 *
 * Testit kuvaavat sitä, mitä koodi tekee tällä hetkellä - mikä ei aina ole
 * sitä, mitä sen kuuluisi tehdä. QUESTIONABLE-merkityt tapaukset on lukittu
 * tarkoituksella sellaisenaan; ks. kunkin kohdalla oleva selitys.
 */
describe('getValuesForSaving', () => {
  test.each([
    // --- perustapaukset: rekisteröidyt kentät values-objektista --------------
    {
      name: 'writes a registered top-level field',
      values: { a: 1 },
      registeredFields: registered('a'),
      unregisteredFields: {},
      initialValues: {},
      expected: { a: 1 },
    },
    {
      name: 'writes a registered nested field',
      values: { x: { y: 1 } },
      registeredFields: registered('x.y'),
      unregisteredFields: {},
      initialValues: {},
      expected: { x: { y: 1 } },
    },
    {
      name: 'keeps initialValues that no field touches',
      values: {},
      registeredFields: {},
      unregisteredFields: {},
      initialValues: { keep: 1 },
      expected: { keep: 1 },
    },
    {
      name: 'writes an explicit null from values',
      values: { a: null },
      registeredFields: registered('a'),
      unregisteredFields: {},
      initialValues: {},
      expected: { a: null },
    },

    // --- rekisteröimättömät kentät asetetaan nulliksi ------------------------
    {
      name: 'nulls an unregistered top-level field',
      values: { a: 1 },
      registeredFields: {},
      unregisteredFields: registered('a'),
      initialValues: { a: 1 },
      expected: { a: null },
    },
    {
      name: 'nulls an unregistered nested field but leaves its siblings',
      values: {},
      registeredFields: {},
      unregisteredFields: registered('x.y'),
      initialValues: { x: { y: 1, z: 2 } },
      expected: { x: { y: null, z: 2 } },
    },
    {
      name: 'registering a child of an unregistered parent drops the parent siblings',
      values: { p: { c: 5 } },
      registeredFields: registered('p.c'),
      unregisteredFields: registered('p'),
      initialValues: { p: { c: 1, other: 2 } },
      expected: { p: { c: 5 } },
    },

    // --- kielipäätteet poistetaan ennen käyttöä ------------------------------
    // getFieldNameWithoutLanguage muuttaa polun `x.nimi.sv` muotoon `x.nimi`,
    // joten rekisteröintiä seurataan KENTTÄ- eikä kielikohtaisesti.
    {
      name: 'registering one language writes the whole translated object',
      values: { nimi: { fi: 'nimi fi', sv: 'nimi sv' } },
      registeredFields: registered('nimi.fi'),
      unregisteredFields: {},
      initialValues: {},
      expected: { nimi: { fi: 'nimi fi', sv: 'nimi sv' } },
    },
    {
      // Huom: tämä nollaa koko käännösobjektin vain siksi, että yhtäkään kieltä
      // ei ole rekisteröitynä. Käytännössä kieliversion poistaminen EI nollaa
      // kenttää, koska FormCollapse vaihtaa aktiivisen kielen tilalle
      // languages[0]:n, jolloin sisarkieli pysyy rekisteröitynä ja alla oleva
      // rekisteröityjen silmukka kirjoittaa koko objektin takaisin.
      name: 'unregistering a language nulls the whole translated field when no language stays registered',
      values: { nimi: { fi: 'a', sv: 'b', en: 'c' } },
      registeredFields: {},
      unregisteredFields: registered('nimi.fi'),
      initialValues: { nimi: { fi: 'a', sv: 'b', en: 'c' } },
      expected: { nimi: null },
    },
    {
      // Sama tilanne, mutta sisarkieli on rekisteröitynä - eli se mitä
      // kieliversion poistaminen oikeasti tekee. Mitään ei nollata.
      name: 'a registered sibling language prevents the null',
      values: { nimi: { fi: 'a', sv: 'b', en: 'c' } },
      registeredFields: registered('nimi.sv'),
      unregisteredFields: registered('nimi.fi'),
      initialValues: { nimi: { fi: 'a', sv: 'b', en: 'c' } },
      expected: { nimi: { fi: 'a', sv: 'b', en: 'c' } },
    },
    {
      name: 'unregistering all languages nulls the field',
      values: { nimi: { fi: 'nimi fi', sv: 'nimi sv' } },
      registeredFields: {},
      unregisteredFields: registered('nimi.fi', 'nimi.sv'),
      initialValues: {},
      expected: { nimi: null },
    },
    {
      name: 'a registered language beats an unregistered one (unregister runs first)',
      values: { nimi: { fi: 'a', sv: 'b' } },
      registeredFields: registered('nimi.sv'),
      unregisteredFields: registered('nimi.fi'),
      initialValues: { nimi: { fi: 'a', sv: 'b' } },
      expected: { nimi: { fi: 'a', sv: 'b' } },
    },
    {
      name: 'registered wins when the same field is both registered and unregistered',
      values: { nimi: { fi: 'nimi fi', sv: 'nimi sv' } },
      registeredFields: registered('nimi.fi', 'nimi.sv'),
      unregisteredFields: registered('nimi.fi'),
      initialValues: {},
      expected: { nimi: { fi: 'nimi fi', sv: 'nimi sv' } },
    },
    {
      name: 'registered wins over a wider unregistered set',
      values: { nimi: { fi: 'nimi fi', sv: 'nimi sv' } },
      registeredFields: registered('nimi.fi'),
      unregisteredFields: registered('nimi.fi', 'nimi.sv'),
      initialValues: {},
      expected: { nimi: { fi: 'nimi fi', sv: 'nimi sv' } },
    },

    // --- järjestys: vanhemmat kirjoitetaan ennen lapsia ----------------------
    // Vanhemman polku on aina lapsensa polun aito alkuosa, ja alkuosa lajittuu
    // ensin, joten aakkosjärjestys takaa vanhempi-ennen-lasta -järjestyksen.
    {
      name: 'writes an array parent before its children',
      values: { nimet: [{ nimi: { fi: '' } }] },
      registeredFields: registered('nimet[0].nimi.fi', 'nimet'),
      unregisteredFields: {},
      initialValues: {},
      expected: { nimet: [{ nimi: {} }] },
    },
    {
      name: 'replaces a shrunk array wholesale when the parent is registered',
      values: { n: [{ v: 'a' }, { v: 'c' }] },
      registeredFields: registered('n', 'n[0].v', 'n[1].v'),
      unregisteredFields: {},
      initialValues: { n: [{ v: 'a' }, { v: 'b' }, { v: 'c' }] },
      expected: { n: [{ v: 'a' }, { v: 'c' }] },
    },
    {
      name: 'writes a whole array from a registered parent alone',
      values: { n: [{ v: 1 }] },
      registeredFields: registered('n'),
      unregisteredFields: {},
      initialValues: {},
      expected: { n: [{ v: 1 }] },
    },
    {
      name: 'handles arrays past index 9, where [10] sorts before [2]',
      values: { n: Array.from({ length: 11 }, (_, i) => ({ v: i })) },
      registeredFields: registered(
        'n',
        ...Array.from({ length: 11 }, (_, i) => `n[${i}].v`)
      ),
      unregisteredFields: {},
      initialValues: {},
      expected: { n: Array.from({ length: 11 }, (_, i) => ({ v: i })) },
    },

    // --- täysin tyhjät käännöskentät tiivistyvät muotoon {} ------------------
    {
      name: 'collapses an all-empty translated field to an empty object',
      values: { nimi: { fi: '', sv: '' } },
      registeredFields: registered('nimi.fi'),
      unregisteredFields: {},
      initialValues: {},
      expected: { nimi: {} },
    },
    {
      name: 'keeps a partly-filled translated field as-is',
      values: { nimi: { fi: '', sv: 'b' } },
      registeredFields: registered('nimi.fi'),
      unregisteredFields: {},
      initialValues: {},
      expected: { nimi: { fi: '', sv: 'b' } },
    },
    {
      name: 'leaves a plain empty object alone (no language keys)',
      values: { x: {} },
      registeredFields: registered('x'),
      unregisteredFields: {},
      initialValues: {},
      expected: { x: {} },
    },

    // --- copyPathsIfDefined: aina tallennettavat polut -----------------------
    // Nämä polut tallennetaan, vaikka niille ei olisi yhtään kenttää
    // renderöitynä. Tämä lista on ainoa asia, joka pitää tarjoajat.tarjoajat-
    // arvon hengissä silloin, kun TarjoajatSection piilottaa valitsimen.
    {
      name: 'copies allowlisted paths even with nothing registered',
      values: {
        esikatselu: true,
        koulutustyyppi: 'amm',
        muokkaaja: '1.2.246.562.24.1',
        information: { nimi: { fi: 'n' }, muu: 'ignored' },
        tarjoajat: { tarjoajat: ['1.2.3'] },
      },
      registeredFields: {},
      unregisteredFields: {},
      initialValues: {},
      expected: {
        esikatselu: true,
        koulutustyyppi: 'amm',
        muokkaaja: '1.2.246.562.24.1',
        information: { nimi: { fi: 'n' } },
        tarjoajat: { tarjoajat: ['1.2.3'] },
      },
    },
    {
      name: 'the allowlist runs last and overrides an unregistered null',
      values: { tarjoajat: { tarjoajat: ['1.2.3'] } },
      registeredFields: {},
      unregisteredFields: registered('tarjoajat.tarjoajat'),
      initialValues: { tarjoajat: { tarjoajat: ['9.9.9'] } },
      expected: { tarjoajat: { tarjoajat: ['1.2.3'] } },
    },
    {
      name: 'does not copy an allowlisted path that is undefined in values',
      values: {},
      registeredFields: {},
      unregisteredFields: {},
      initialValues: { koulutustyyppi: 'lk' },
      expected: { koulutustyyppi: 'lk' },
    },
  ])(
    '$name',
    ({
      values,
      registeredFields,
      unregisteredFields,
      initialValues,
      expected,
    }) => {
      expect(
        getValuesForSaving(
          values,
          registeredFields,
          unregisteredFields,
          initialValues
        )
      ).toEqual(expected);
    }
  );

  // --- tapaukset, joissa syvä yhtäsuuruusvertailu ei riitä -------------------

  test('does not mutate initialValues', () => {
    const initialValues = { deep: { a: 1 } };
    getValuesForSaving({}, {}, registered('deep.a'), initialValues);
    expect(initialValues).toEqual({ deep: { a: 1 } });
  });

  test('a registered field with no value is omitted from the payload, not nulled', () => {
    // Ero näkyy lähetettävässä datassa: rekisteröimätön kenttä lähetetään
    // nullina (jolloin kouta-backend tyhjentää sen), kun taas rekisteröity
    // kenttä ilman arvoa putoaa pois JSON.stringifyssä ja jää siten
    // koskemattomaksi.
    const result = getValuesForSaving({}, registered('a'), {}, { a: 1 });

    expect(Object.prototype.hasOwnProperty.call(result, 'a')).toBe(true);
    expect(result.a).toBeUndefined();
    expect(JSON.parse(JSON.stringify(result))).toEqual({});
  });

  test('the result does not depend on unregisteredFields insertion order', () => {
    // Molemmat silmukat lajitellaan, joten UNREGISTER_FIELD-actionien
    // saapumisjärjestys ei vaikuta lopputulokseen. Ennen korjausta
    // vanhempi-ensin tuotti { p: { c: null } } ja lapsi-ensin { p: null }.
    const initialValues = { p: { c: 1, other: 2 } };

    const childFirst = getValuesForSaving(
      {},
      {},
      registered('p.c', 'p'),
      initialValues
    );
    const parentFirst = getValuesForSaving(
      {},
      {},
      registered('p', 'p.c'),
      initialValues
    );

    expect(childFirst).toEqual({ p: null });
    expect(parentFirst).toEqual({ p: null });
  });

  test('nulls a hidden FieldArray as null, not as an array of nulled objects', () => {
    // Piilotetusta FieldArraysta poistuu rekisteristä sekä taulukon oma nimi
    // että jokaisen alkion kentät. Ilman laskevaa lajittelua backendiin
    // lähtisi [{ alkaa: null, paattyy: null }, ...] eikä null.
    const initialValues = {
      hakuajat: {
        hakuajat: [
          { alkaa: 'A', paattyy: 'B' },
          { alkaa: 'C', paattyy: 'D' },
        ],
      },
    };
    const unregistered = registered(
      'hakuajat.hakuajat',
      'hakuajat.hakuajat[0].alkaa',
      'hakuajat.hakuajat[0].paattyy',
      'hakuajat.hakuajat[1].alkaa',
      'hakuajat.hakuajat[1].paattyy'
    );

    expect(getValuesForSaving({}, {}, unregistered, initialValues)).toEqual({
      hakuajat: { hakuajat: null },
    });
  });
});

// getFieldNameWithoutLanguage tekee rekisteröinnistä KENTTÄ- eikä
// kielikohtaisen, joten getValuesForSaving riippuu suoraan näistä
// reunatapauksista.
test.each([
  ['nimi.fi', 'nimi'],
  ['nimi.sv', 'nimi'],
  ['nimi.en', 'nimi'],
  ['nimi', 'nimi'],
  ['perustiedot.nimi', 'perustiedot.nimi'],
  ['a.b.fi', 'a.b'],
  // vain yksi kielipääte poistetaan
  ['nimi.fi.fi', 'nimi.fi'],
  // kielen mukaan nimetty kenttä ei typisty tyhjäksi
  ['fi', 'fi'],
  // pelkästään kielikoodilla alkava osa jätetään ennalleen
  ['a.finnish', 'a.finnish'],
  ['liitteet[0].toimitusaika', 'liitteet[0].toimitusaika'],
  // QUESTIONABLE: tyhjä nimi palauttaa undefined, jonka getValuesForSaving
  // antaa lodashin set()-funktiolle non-null-assertionin takaa.
  ['', undefined],
])('getFieldNameWithoutLanguage %j -> %j', (name, fieldName) => {
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

describe('getTermsByLanguage', () => {
  test('it should return empty array when no terms to store', () => {
    const values = {};
    expect(getTermsByLanguage(values)).toEqual([]);
  });

  test('it should return an array with one language-term pair', () => {
    const values = {
      fi: [
        {
          label: 'foo',
          value: 'foo',
        },
      ],
    };
    expect(getTermsByLanguage(values)).toEqual([{ kieli: 'fi', arvo: 'foo' }]);
  });

  test('it should return an array with several language-term pairs', () => {
    const values = {
      fi: [
        {
          label: 'foo',
          value: 'foo',
        },
        {
          label: 'joo',
          value: 'joo',
        },
      ],
    };
    expect(getTermsByLanguage(values)).toEqual([
      { kieli: 'fi', arvo: 'foo' },
      { kieli: 'fi', arvo: 'joo' },
    ]);
  });

  test('it should return an array with several language-term pairs for two different languages', () => {
    const values = {
      fi: [
        {
          label: 'foo',
          value: 'foo',
        },
      ],
      sv: [
        {
          label: 'heja',
          value: 'heja',
        },
        {
          label: 'hopsan',
          value: 'hopsan',
        },
      ],
    };
    expect(getTermsByLanguage(values)).toEqual([
      { kieli: 'fi', arvo: 'foo' },
      { kieli: 'sv', arvo: 'heja' },
      { kieli: 'sv', arvo: 'hopsan' },
    ]);
  });
});
