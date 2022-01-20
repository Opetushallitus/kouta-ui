import {
  getKielistettyOrganisaatioContactInfo,
  getKielistettyOsoite,
  getKielistetty,
} from './getOrganisaatioContactInfo.ts';

test('getKielistetty returns finnish and swedish email addresses', () => {
  const emails = [
    {
      kieli: 'kieli_fi#1',
      email: 'testiosoite@testi.fi',
    },
    {
      kieli: 'kieli_sv#1',
      email: 'testiosoite@test.sv',
    },
  ];

  const result = {
    fi: 'testiosoite@testi.fi',
    sv: 'testiosoite@test.sv',
  };
  expect(getKielistetty(emails, 'email')).toEqual(result);
});

test('getKielistettyOrganisaatioContactInfo returns finnish email as the only contact info', () => {
  const contactInfo = [
    {
      kieli: 'kieli_fi#1',
      email: 'testiosoite@testi.fi',
    },
  ];

  const result = {
    sahkoposti: { fi: 'testiosoite@testi.fi' },
  };
  expect(getKielistettyOrganisaatioContactInfo(contactInfo)).toEqual(result);
});

test('getKielistettyOrganisaatioContactInfo returns finnish and swedish emails as contact info', () => {
  const contactInfo = [
    {
      kieli: 'kieli_fi#1',
      email: 'testiosoite@testi.fi',
    },
    {
      kieli: 'kieli_sv#1',
      email: 'testiosoite@test.sv',
    },
  ];

  const result = {
    sahkoposti: { fi: 'testiosoite@testi.fi', sv: 'testiosoite@test.sv' },
  };
  expect(getKielistettyOrganisaatioContactInfo(contactInfo)).toEqual(result);
});

test('getKielistettyOsoite returns finnish kayntiosoite in its string format of katuosoite, postinumero and -toimipaikka', () => {
  const osoite = [
    {
      osoiteTyyppi: 'kaynti',
      kieli: 'kieli_fi#1',
      postinumeroUri: 'posti_01230',
      postitoimipaikka: 'HELSINKI',
      osoite: 'Veneheittoaukio 328',
    },
  ];

  const result = {
    fi: 'Veneheittoaukio 328, 01230 Helsinki',
  };

  expect(getKielistettyOsoite(osoite)).toEqual(result);
});

test('getKielistettyOsoite returns finnish and swedish kayntiosoitteet', () => {
  const kayntiosoitteet = [
    {
      osoiteTyyppi: 'kaynti',
      kieli: 'kieli_fi#1',
      postinumeroUri: 'posti_01230',
      postitoimipaikka: 'HELSINKI',
      osoite: 'Veneheittoaukio 328',
    },
    {
      osoiteTyyppi: 'kaynti',
      kieli: 'kieli_sv#1',
      postinumeroUri: 'posti_01110',
      postitoimipaikka: 'HELSINGFORS',
      osoite: 'Kurinraitti 799',
    },
  ];

  const result = {
    fi: 'Veneheittoaukio 328, 01230 Helsinki',
    sv: 'Kurinraitti 799, 01110 Helsingfors',
  };
  expect(getKielistettyOsoite(kayntiosoitteet)).toEqual(result);
});

test('getKielistettyOrganisaatioContactInfo returns emails and kayntiosoite as contact info', () => {
  const contactInfo = [
    {
      kieli: 'kieli_fi#1',
      email: 'testiosoite@testi.fi',
    },
    {
      osoiteTyyppi: 'kaynti',
      kieli: 'kieli_fi#1',
      postinumeroUri: 'posti_01230',
      postitoimipaikka: 'HELSINKI',
      osoite: 'Veneheittoaukio 328',
    },
    {
      osoiteTyyppi: 'kaynti',
      kieli: 'kieli_sv#1',
      postinumeroUri: 'posti_01110',
      postitoimipaikka: 'HELSINGFORS',
      osoite: 'Kurinraitti 799',
    },
    {
      kieli: 'kieli_sv#1',
      email: 'testiosoite@test.sv',
    },
  ];

  const result = {
    sahkoposti: { fi: 'testiosoite@testi.fi', sv: 'testiosoite@test.sv' },
    kaynti: {
      fi: 'Veneheittoaukio 328, 01230 Helsinki',
      sv: 'Kurinraitti 799, 01110 Helsingfors',
    },
  };
  expect(getKielistettyOrganisaatioContactInfo(contactInfo)).toEqual(result);
});

test('getKielistettyOrganisaatioContactInfo returns kielistetty puhelinnumero', () => {
  const contactInfo = [
    {
      kieli: 'kieli_fi#1',
      numero: '050 33903791',
      tyyppi: 'puhelin',
    },
    {
      kieli: 'kieli_sv#1',
      numero: '050 33901111',
      tyyppi: 'puhelin',
    },
  ];

  const result = {
    puhelinnumero: { fi: '050 33903791', sv: '050 33901111' },
  };
  expect(getKielistettyOrganisaatioContactInfo(contactInfo)).toEqual(result);
});

test('getKielistettyOsoite uses ulkomainen_kaynti data for english ulkomainen osoite', () => {
  const ulkomaisetOsoitteet = [
    {
      osoiteTyyppi: 'ulkomainen_kaynti',
      kieli: 'kieli_en#1',
      osoite: '1 Example Street\nNortholt\nLondon\nUB5 4AS\nUK',
    },
  ];

  const result = {
    en: '1 Example Street, Northolt, London, UB5 4AS, UK',
  };
  expect(getKielistettyOsoite([], ulkomaisetOsoitteet)).toEqual(result);
});

test('getKielistettyOsoite returns finnish kayntiosoite and uses ulkomainen_kaynti for english kayntiosoite', () => {
  const kayntiosoitteet = [
    {
      osoiteTyyppi: 'kaynti',
      kieli: 'kieli_fi#1',
      postinumeroUri: 'posti_01230',
      postitoimipaikka: 'HELSINKI',
      osoite: 'Veneheittoaukio 328',
    },
  ];

  const ulkomaisetOsoitteet = [
    {
      osoiteTyyppi: 'ulkomainen_kaynti',
      kieli: 'kieli_en#1',
      osoite: '1 Example Street\nNortholt\nLondon\nUB5 4AS\nUK',
    },
  ];

  const result = {
    fi: 'Veneheittoaukio 328, 01230 Helsinki',
    en: '1 Example Street, Northolt, London, UB5 4AS, UK',
  };
  expect(getKielistettyOsoite(kayntiosoitteet, ulkomaisetOsoitteet)).toEqual(
    result
  );
});

test('getKielistettyOsoite does not take ulkomainen_kaynti osoite into account as english lang osoite is found from kayntiosoitteet', () => {
  const kayntiosoitteet = [
    {
      osoiteTyyppi: 'kaynti',
      kieli: 'kieli_en#1',
      postinumeroUri: 'posti_00921',
      postitoimipaikka: 'HELSINKI',
      osoite: 'Polvivaara 3',
    },
  ];

  const ulkomaisetOsoitteet = [
    {
      osoiteTyyppi: 'ulkomainen_kaynti',
      kieli: 'kieli_en#1',
      osoite: '1 Example Street\nNortholt\nLondon\nUB5 4AS\nUK',
    },
  ];

  const result = {
    en: 'Polvivaara 3, 00921 Helsinki',
  };
  expect(getKielistettyOsoite(kayntiosoitteet, ulkomaisetOsoitteet)).toEqual(
    result
  );
});

test('getKielistettyOrganisaatioContactInfo returns ulkomainen kayntiosoite as a part of contact info', () => {
  const contactInfo = [
    {
      osoiteTyyppi: 'kaynti',
      kieli: 'kieli_fi#1',
      postinumeroUri: 'posti_01230',
      postitoimipaikka: 'HELSINKI',
      osoite: 'Veneheittoaukio 328',
    },
    {
      osoiteTyyppi: 'kaynti',
      kieli: 'kieli_sv#1',
      postinumeroUri: 'posti_01110',
      postitoimipaikka: 'HELSINGFORS',
      osoite: 'Kurinraitti 799',
    },
    {
      osoiteTyyppi: 'ulkomainen_kaynti',
      kieli: 'kieli_en#1',
      osoite: '1 Example Street\nNortholt\nLondon\nUB5 4AS\nUK',
    },
  ];

  const result = {
    kaynti: {
      fi: 'Veneheittoaukio 328, 01230 Helsinki',
      sv: 'Kurinraitti 799, 01110 Helsingfors',
      en: '1 Example Street, Northolt, London, UB5 4AS, UK',
    },
  };
  expect(getKielistettyOrganisaatioContactInfo(contactInfo)).toEqual(result);
});

test('getKielistettyOrganisaatioContactInfo returns postiosoite as contact info', () => {
  const contactInfo = [
    {
      osoiteTyyppi: 'posti',
      kieli: 'kieli_fi#1',
      postinumeroUri: 'posti_01230',
      postitoimipaikka: 'HELSINKI',
      osoite: 'Veneheittoaukio 328',
    },
    {
      osoiteTyyppi: 'posti',
      kieli: 'kieli_sv#1',
      postinumeroUri: 'posti_01110',
      postitoimipaikka: 'HELSINGFORS',
      osoite: 'Kurinraitti 799',
    },
    {
      osoiteTyyppi: 'ulkomainen_posti',
      kieli: 'kieli_en#1',
      osoite: '1 Example Street\nNortholt\nLondon\nUB5 4AS\nUK',
    },
  ];

  const result = {
    posti: {
      fi: 'Veneheittoaukio 328, 01230 Helsinki',
      sv: 'Kurinraitti 799, 01110 Helsingfors',
      en: '1 Example Street, Northolt, London, UB5 4AS, UK',
    },
  };
  expect(getKielistettyOrganisaatioContactInfo(contactInfo)).toEqual(result);
});
