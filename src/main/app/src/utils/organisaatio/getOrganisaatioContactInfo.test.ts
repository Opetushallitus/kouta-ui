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
