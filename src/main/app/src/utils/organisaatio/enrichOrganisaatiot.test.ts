import type {
  OrganisaatioModel,
  OppilaitosModel,
} from '#/src/types/domainTypes';

import { enrichOrganisaatiot } from './enrichOrganisaatiot';

test('should add jarjestaaUrheilijanAmmKoulutusta for one org', () => {
  const orgs_from_organisaatiopalvelu: Array<OrganisaatioModel> = [
    {
      oid: '1.2.246.562.10.2013111415031319523704',
      parentOids: [
        '1.2.246.562.10.00000000001',
        '1.2.246.562.10.63184540803',
        '1.2.246.562.10.2013110715495487451932',
        '1.2.246.562.10.2013111415031319523704',
      ],
      nimi: {},
      kieletUris: [],
    },
  ];

  const oppilaitokset_from_kouta: Array<OppilaitosModel> = [
    {
      oid: '1.2.246.562.10.2013110715495487451932',
      tila: 'julkaistu',
      metadata: {
        wwwSivu: {
          nimi: {},
          url: {
            fi: 'https://www.osao.fi',
          },
        },
        opiskelijoita: 8500,
        yksikoita: 9,
      },
      organisaatioOid: '1.2.246.562.10.2013110715495487451932',
      modified: '2022-01-20T16:42:30',
      osat: [
        {
          oid: '1.2.246.562.10.2013111415031319523704',
          oppilaitosOid: '1.2.246.562.10.2013110715495487451932',
          tila: 'julkaistu',
          metadata: {
            wwwSivu: {
              nimi: {},
              url: {
                fi: 'https://www.osao.fi/tietoa-hakemisesta/yksikot/kaukovainion-yksikko-palvelut/',
              },
            },
            esittely: {
              fi: '<p>Lorem ipsum</p>',
            },
            jarjestaaUrheilijanAmmKoulutusta: true,
          },
          kielivalinta: ['fi'],
          organisaatioOid: '1.2.246.562.10.2013111415031319523704',
        },
      ],
    },
  ];

  const result = [
    {
      oid: '1.2.246.562.10.2013111415031319523704',
      parentOids: [
        '1.2.246.562.10.00000000001',
        '1.2.246.562.10.63184540803',
        '1.2.246.562.10.2013110715495487451932',
        '1.2.246.562.10.2013111415031319523704',
      ],
      jarjestaaUrheilijanAmmKoulutusta: true,
      nimi: {},
      kieletUris: [],
    },
  ];
  expect(
    enrichOrganisaatiot(orgs_from_organisaatiopalvelu, oppilaitokset_from_kouta)
  ).toEqual(result);
});

test('should add jarjestaaUrheilijanAmmKoulutusta for two orgs', () => {
  const orgs_from_organisaatiopalvelu: Array<OrganisaatioModel> = [
    {
      oid: '1.2.246.562.10.2013111415031319523704',
      parentOids: [
        '1.2.246.562.10.00000000001',
        '1.2.246.562.10.63184540803',
        '1.2.246.562.10.2013110715495487451932',
        '1.2.246.562.10.2013111415031319523704',
      ],
      nimi: {},
      kieletUris: [],
    },
    {
      oid: '1.2.246.562.10.2013111415312640960525',
      parentOids: [
        '1.2.246.562.10.00000000001',
        '1.2.246.562.10.63184540803',
        '1.2.246.562.10.2013110715495487451932',
        '1.2.246.562.10.2013111415312640960525',
      ],
      nimi: {},
      kieletUris: [],
    },
  ];

  const oppilaitokset_from_kouta: Array<OppilaitosModel> = [
    {
      oid: '1.2.246.562.10.2013110715495487451932',
      organisaatioOid: '1.2.246.562.10.2013110715495487451932',
      osat: [
        {
          oid: '1.2.246.562.10.2013111415031319523704',
          oppilaitosOid: '1.2.246.562.10.2013110715495487451932',
          tila: 'julkaistu',
          metadata: {
            esittely: {
              fi: '<p>Lorem ipsum</p>',
            },
            jarjestaaUrheilijanAmmKoulutusta: true,
          },
          organisaatioOid: '1.2.246.562.10.2013111415031319523704',
        },
      ],
    },
    {
      oid: '1.2.246.562.10.2013110715495487451932',
      tila: 'julkaistu',
      organisaatioOid: '1.2.246.562.10.2013110715495487451932',
      osat: [
        {
          oid: '1.2.246.562.10.1234567891234567891234',
          oppilaitosOid: '1.2.246.562.10.2013110715495487451932',
          tila: 'julkaistu',
          metadata: {
            jarjestaaUrheilijanAmmKoulutusta: true,
          },
          organisaatioOid: '1.2.246.562.10.1234567891234567891234',
        },
        {
          oid: '1.2.246.562.10.2013111415312640960525',
          oppilaitosOid: '1.2.246.562.10.2013110715495487451932',
          tila: 'julkaistu',
          metadata: {
            jarjestaaUrheilijanAmmKoulutusta: false,
          },
          organisaatioOid: '1.2.246.562.10.2013111415312640960525',
        },
      ],
    },
  ];

  const result = [
    {
      oid: '1.2.246.562.10.2013111415031319523704',
      parentOids: [
        '1.2.246.562.10.00000000001',
        '1.2.246.562.10.63184540803',
        '1.2.246.562.10.2013110715495487451932',
        '1.2.246.562.10.2013111415031319523704',
      ],
      jarjestaaUrheilijanAmmKoulutusta: true,
      nimi: {},
      kieletUris: [],
    },
    {
      oid: '1.2.246.562.10.2013111415312640960525',
      parentOids: [
        '1.2.246.562.10.00000000001',
        '1.2.246.562.10.63184540803',
        '1.2.246.562.10.2013110715495487451932',
        '1.2.246.562.10.2013111415312640960525',
      ],
      jarjestaaUrheilijanAmmKoulutusta: false,
      nimi: {},
      kieletUris: [],
    },
  ];
  expect(
    enrichOrganisaatiot(orgs_from_organisaatiopalvelu, oppilaitokset_from_kouta)
  ).toEqual(result);
});

test('should not add jarjestaaUrheilijanAmmKoulutusta for oppilaitos org that does not have the value', () => {
  const orgs_from_organisaatiopalvelu: Array<OrganisaatioModel> = [
    {
      oid: '1.2.246.562.10.96162204109',
      parentOids: [
        '1.2.246.562.10.00000000001',
        '1.2.246.562.10.48442622063',
        '1.2.246.562.10.96162204109',
      ],
      nimi: {},
      kieletUris: [],
    },
  ];

  const oppilaitokset_from_kouta: Array<OppilaitosModel> = [
    {
      oid: '1.2.246.562.10.96162204109',
      tila: 'julkaistu',
      metadata: {},
      organisaatioOid: '1.2.246.562.10.96162204109',
      osat: [],
    },
  ];

  const result = [
    {
      oid: '1.2.246.562.10.96162204109',
      parentOids: [
        '1.2.246.562.10.00000000001',
        '1.2.246.562.10.48442622063',
        '1.2.246.562.10.96162204109',
      ],
      nimi: {},
      kieletUris: [],
      jarjestaaUrheilijanAmmKoulutusta: false,
    },
  ];
  expect(
    enrichOrganisaatiot(orgs_from_organisaatiopalvelu, oppilaitokset_from_kouta)
  ).toEqual(result);
});

test('should add jarjestaaUrheilijanAmmKolutusta from parent oppilaitos to toimipiste even if it does not exist in kouta', () => {
  const orgs_from_organisaatiopalvelu: Array<OrganisaatioModel> = [
    {
      oid: '1.2.246.562.10.1234567891234567891234',
      parentOids: [
        '1.2.246.562.10.00000000001',
        '1.2.246.562.10.48442622063',
        '1.2.246.562.10.96162204109',
        '1.2.246.562.10.1234567891234567891234',
      ],
      nimi: {},
      kieletUris: [],
    },
  ];

  const oppilaitokset_from_kouta: Array<OppilaitosModel> = [
    {
      oid: '1.2.246.562.10.96162204109',
      tila: 'julkaistu',
      organisaatioOid: '1.2.246.562.10.96162204109',
      metadata: {
        wwwSivu: {
          nimi: {},
          url: {},
        },
        jarjestaaUrheilijanAmmKoulutusta: true,
      },
      osat: [],
    },
  ];

  const result = [
    {
      oid: '1.2.246.562.10.1234567891234567891234',
      parentOids: [
        '1.2.246.562.10.00000000001',
        '1.2.246.562.10.48442622063',
        '1.2.246.562.10.96162204109',
        '1.2.246.562.10.1234567891234567891234',
      ],
      nimi: {},
      kieletUris: [],
      jarjestaaUrheilijanAmmKoulutusta: true,
    },
  ];
  expect(
    enrichOrganisaatiot(orgs_from_organisaatiopalvelu, oppilaitokset_from_kouta)
  ).toEqual(result);
});
