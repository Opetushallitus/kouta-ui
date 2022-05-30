import { enrichOrganisaatiot } from './enrichOrganisaatiot';

test('should add jarjestaaUrheilijanAmmKoulutusta for one org', () => {
  const orgs_from_organisaatiopalvelu = [
    {
      oid: '1.2.246.562.10.2013111415031319523704',
      parentOid: '1.2.246.562.10.2013110715495487451932',
      parentOidPath:
        '1.2.246.562.10.2013111415031319523704/1.2.246.562.10.2013110715495487451932/1.2.246.562.10.63184540803/1.2.246.562.10.00000000001',
    },
  ];

  const oppilaitokset_from_kouta = [
    {
      oid: '1.2.246.562.10.2013111415031319523704',
      oppilaitos: {
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
            modified: '2022-01-20T16:42:30',
          },
        ],
      },
    },
  ];

  const result = [
    {
      oid: '1.2.246.562.10.2013111415031319523704',
      parentOid: '1.2.246.562.10.2013110715495487451932',
      parentOidPath:
        '1.2.246.562.10.2013111415031319523704/1.2.246.562.10.2013110715495487451932/1.2.246.562.10.63184540803/1.2.246.562.10.00000000001',
      jarjestaaUrheilijanAmmKoulutusta: true,
    },
  ];
  expect(
    enrichOrganisaatiot(orgs_from_organisaatiopalvelu, oppilaitokset_from_kouta)
  ).toEqual(result);
});

test('should add jarjestaaUrheilijanAmmKoulutusta for one two orgs', () => {
  const orgs_from_organisaatiopalvelu = [
    {
      oid: '1.2.246.562.10.2013111415031319523704',
      parentOid: '1.2.246.562.10.2013110715495487451932',
      parentOidPath:
        '1.2.246.562.10.2013111415031319523704/1.2.246.562.10.2013110715495487451932/1.2.246.562.10.63184540803/1.2.246.562.10.00000000001',
    },
    {
      oid: '1.2.246.562.10.2013111415312640960525',
      parentOid: '1.2.246.562.10.2013110715495487451932',
      parentOidPath:
        '1.2.246.562.10.2013111415312640960525/1.2.246.562.10.2013110715495487451932/1.2.246.562.10.63184540803/1.2.246.562.10.00000000001',
    },
  ];

  const oppilaitokset_from_kouta = [
    {
      oid: '1.2.246.562.10.2013111415031319523704',
      oppilaitos: {
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
    },
    {
      oid: '1.2.246.562.10.2013111415312640960525',
      oppilaitos: {
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
    },
  ];

  const result = [
    {
      oid: '1.2.246.562.10.2013111415031319523704',
      parentOid: '1.2.246.562.10.2013110715495487451932',
      parentOidPath:
        '1.2.246.562.10.2013111415031319523704/1.2.246.562.10.2013110715495487451932/1.2.246.562.10.63184540803/1.2.246.562.10.00000000001',
      jarjestaaUrheilijanAmmKoulutusta: true,
    },
    {
      oid: '1.2.246.562.10.2013111415312640960525',
      parentOid: '1.2.246.562.10.2013110715495487451932',
      parentOidPath:
        '1.2.246.562.10.2013111415312640960525/1.2.246.562.10.2013110715495487451932/1.2.246.562.10.63184540803/1.2.246.562.10.00000000001',
      jarjestaaUrheilijanAmmKoulutusta: false,
    },
  ];
  expect(
    enrichOrganisaatiot(orgs_from_organisaatiopalvelu, oppilaitokset_from_kouta)
  ).toEqual(result);
});
