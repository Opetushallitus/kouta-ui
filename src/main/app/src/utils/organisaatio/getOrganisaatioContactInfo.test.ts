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

test('getOrganisaatioKielistettyContactInfo returns finnish email as the only contact info', () => {
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

test('getOrganisaatioKielistettyContactInfo returns finnish and swedish emails as contact info', () => {
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

test('getKielistettyOsoite returns finnish kayntiosoite as the only address', () => {
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
    katuosoite: { fi: 'Veneheittoaukio 328' },
    postinumero: { fi: '01230' },
    postitoimipaikka: { fi: 'Helsinki' },
  };

  expect(getKielistettyOsoite(osoite)).toEqual(result);
});

test('getKielistetytOsoitteet returns finnish and swedish kayntiosoitteet as kaynti object', () => {
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
    katuosoite: { fi: 'Veneheittoaukio 328', sv: 'Kurinraitti 799' },
    postinumero: { fi: '01230', sv: '01110' },
    postitoimipaikka: { fi: 'Helsinki', sv: 'Helsingfors' },
  };
  expect(getKielistettyOsoite(kayntiosoitteet)).toEqual(result);
});

test('getOrganisaatioKielistettyContactInfo returns finnish and swedish emails as contact info', () => {
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

test('getOrganisaatioKielistettyContactInfo returns emails and kaynti osoite as contact info', () => {
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
      katuosoite: { fi: 'Veneheittoaukio 328', sv: 'Kurinraitti 799' },
      postinumero: { fi: '01230', sv: '01110' },
      postitoimipaikka: { fi: 'Helsinki', sv: 'Helsingfors' },
    },
  };
  expect(getKielistettyOrganisaatioContactInfo(contactInfo)).toEqual(result);
});

test('getOrganisaatioKielistettyContactInfo returns kielistetty puhelinnumero', () => {
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
      osoite: 'Polvivaara 397\n00920 Helsinki',
    },
  ];

  const result = {
    ulkomainenOsoite: { en: 'Polvivaara 397\n00920 Helsinki' },
  };
  expect(getKielistettyOsoite([], ulkomaisetOsoitteet)).toEqual(result);
});

test('getKielistettyOsoite returns finnish kayntiosoite and ulkomainen_kaynti data for english kayntiosoite', () => {
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
      osoite: 'Polvivaara 397\n00920 Helsinki',
    },
  ];

  const result = {
    katuosoite: { fi: 'Veneheittoaukio 328' },
    postinumero: { fi: '01230' },
    postitoimipaikka: { fi: 'Helsinki' },
    ulkomainenOsoite: { en: 'Polvivaara 397\n00920 Helsinki' },
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
      osoite: 'Polvivaara 397\n00920 Helsinki',
    },
  ];

  const result = {
    katuosoite: { en: 'Polvivaara 3' },
    postinumero: { en: '00921' },
    postitoimipaikka: { en: 'Helsinki' },
  };
  expect(getKielistettyOsoite(kayntiosoitteet, ulkomaisetOsoitteet)).toEqual(
    result
  );
});

test('getOrganisaatioKielistettyContactInfo returns ulkomainen kayntiosoite as a part of contact info', () => {
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
      osoite: 'Polvivaara 397\n00920 Helsinki',
    },
  ];

  const result = {
    kaynti: {
      katuosoite: { fi: 'Veneheittoaukio 328', sv: 'Kurinraitti 799' },
      postinumero: { fi: '01230', sv: '01110' },
      postitoimipaikka: { fi: 'Helsinki', sv: 'Helsingfors' },
      ulkomainenOsoite: { en: 'Polvivaara 397\n00920 Helsinki' },
    },
  };
  expect(getKielistettyOrganisaatioContactInfo(contactInfo)).toEqual(result);
});
