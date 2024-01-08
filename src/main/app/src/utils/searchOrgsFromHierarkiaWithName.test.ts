import { searchOrgsFromHierarkiaWithName } from './searchOrgsFromHierarkiaWithName';

test('searchOrgHierarkiaWithName returns the only org in hierarkia as it matches the given name', () => {
  const hierarkia = [
    {
      oid: '1.2.246.562.10.501459103410',
      parentOids: ['1.2.246.562.10.501459103410', '1.2.246.562.10.00000000001'],
      nimi: {
        fi: 'Joku kaupunki',
        sv: 'Joku kaupunki',
        en: 'Joku kaupunki',
      },
      kotipaikkaUri: 'kunta_208',
      children: [
        {
          oid: '1.2.246.562.10.58311582298',
          parentOids: [
            '1.2.246.562.10.501459103410',
            '1.2.246.562.10.00000000001',
          ],
          oppilaitostyyppi: 'oppilaitostyyppi_64#1',
          nimi: {
            fi: 'Eriniminen kansalaisopisto',
            sv: 'Eriniminen kansalaisopisto',
            en: 'Eriniminen kansalaisopisto',
          },
          kotipaikkaUri: 'kunta_208',
          children: [],
          organisaatiotyypit: ['organisaatiotyyppi_02'],
          tyypit: [],
        },
      ],
      organisaatiotyypit: [
        'organisaatiotyyppi_01',
        'organisaatiotyyppi_07',
        'organisaatiotyyppi_09',
      ],
      tyypit: [],
    },
  ];

  expect(searchOrgsFromHierarkiaWithName(hierarkia, 'Joku')).toEqual(hierarkia);
});

test('searchOrgHierarkiaWithName returns only the matching org from hierarkia with its child that has non-matching name', () => {
  const hierarkia = [
    {
      oid: '1.2.246.562.10.353744225710',
      parentOids: ['1.2.246.562.10.353744225710', '1.2.246.562.10.00000000001'],
      nimi: {
        fi: 'Kansanvalistusseura sr',
        sv: 'Kansanvalistusseura sr',
        en: 'Kansanvalistusseura sr',
      },
      kotipaikkaUri: 'kunta_091',
      children: [
        {
          oid: '1.2.246.562.10.92541507692',
          parentOids: [
            '1.2.246.562.10.92541507692',
            '1.2.246.562.10.353744225710',
            '1.2.246.562.10.00000000001',
          ],
          oppilaitostyyppi: 'oppilaitostyyppi_64#1',
          nimi: {
            fi: 'Etelä-Helsingin kansalaisopisto',
            sv: 'Etelä-Helsingin kansalaisopisto',
            en: 'Etelä-Helsingin kansalaisopisto',
          },
          kotipaikkaUri: 'kunta_091',
          children: [],
          organisaatiotyypit: ['organisaatiotyyppi_02'],
          tyypit: [],
        },
      ],
      organisaatiotyypit: ['organisaatiotyyppi_01'],
      tyypit: [],
    },
    {
      oid: '1.2.246.562.10.501459103410',
      parentOids: ['1.2.246.562.10.501459103410', '1.2.246.562.10.00000000001'],
      nimi: {
        fi: 'Joku kaupunki',
        sv: 'Joku kaupunki',
        en: 'Joku kaupunki',
      },
      kotipaikkaUri: 'kunta_208',
      children: [
        {
          oid: '1.2.246.562.10.58311582298',
          parentOids: [
            '1.2.246.562.10.58311582298',
            '1.2.246.562.10.501459103410',
            '1.2.246.562.10.00000000001',
          ],
          oppilaitostyyppi: 'oppilaitostyyppi_64#1',
          nimi: {
            fi: 'Eriniminen kansalaisopisto',
            sv: 'Eriniminen kansalaisopisto',
            en: 'Eriniminen kansalaisopisto',
          },
          kotipaikkaUri: 'kunta_208',
          children: [],
          organisaatiotyypit: ['organisaatiotyyppi_02'],
          tyypit: [],
        },
      ],
      organisaatiotyypit: [
        'organisaatiotyyppi_01',
        'organisaatiotyyppi_07',
        'organisaatiotyyppi_09',
      ],
      tyypit: [],
    },
  ];

  const result = [
    {
      oid: '1.2.246.562.10.501459103410',
      parentOids: ['1.2.246.562.10.501459103410', '1.2.246.562.10.00000000001'],
      nimi: {
        fi: 'Joku kaupunki',
        sv: 'Joku kaupunki',
        en: 'Joku kaupunki',
      },
      kotipaikkaUri: 'kunta_208',
      children: [
        {
          oid: '1.2.246.562.10.58311582298',
          parentOids: [
            '1.2.246.562.10.58311582298',
            '1.2.246.562.10.501459103410',
            '1.2.246.562.10.00000000001',
          ],
          oppilaitostyyppi: 'oppilaitostyyppi_64#1',
          nimi: {
            fi: 'Eriniminen kansalaisopisto',
            sv: 'Eriniminen kansalaisopisto',
            en: 'Eriniminen kansalaisopisto',
          },
          kotipaikkaUri: 'kunta_208',
          children: [],
          organisaatiotyypit: ['organisaatiotyyppi_02'],
          tyypit: [],
        },
      ],
      organisaatiotyypit: [
        'organisaatiotyyppi_01',
        'organisaatiotyyppi_07',
        'organisaatiotyyppi_09',
      ],
      tyypit: [],
    },
  ];
  expect(searchOrgsFromHierarkiaWithName(hierarkia, 'Joku')).toEqual(result);
});

test("searchOrgHierarkiaWithName returns the only org in hierarkia as its child's name matches the given name", () => {
  const hierarkia = [
    {
      oid: '1.2.246.562.10.501459103410',
      parentOids: ['1.2.246.562.10.501459103410', '1.2.246.562.10.00000000001'],
      nimi: {
        fi: 'Joku kaupunki',
        sv: 'Joku kaupunki',
        en: 'Joku kaupunki',
      },
      kotipaikkaUri: 'kunta_208',
      children: [
        {
          oid: '1.2.246.562.10.58311582298',
          parentOids: [
            '1.2.246.562.10.58311582298',
            '1.2.246.562.10.501459103410',
            '1.2.246.562.10.00000000001',
          ],
          oppilaitostyyppi: 'oppilaitostyyppi_64#1',
          nimi: {
            fi: 'Eriniminen kansalaisopisto',
            sv: 'Eriniminen kansalaisopisto',
            en: 'Eriniminen kansalaisopisto',
          },
          kotipaikkaUri: 'kunta_208',
          children: [],
          organisaatiotyypit: ['organisaatiotyyppi_02'],
          tyypit: [],
        },
      ],
      organisaatiotyypit: [
        'organisaatiotyyppi_01',
        'organisaatiotyyppi_07',
        'organisaatiotyyppi_09',
      ],
      tyypit: [],
    },
  ];

  expect(searchOrgsFromHierarkiaWithName(hierarkia, 'Eriniminen')).toEqual(
    hierarkia
  );
});

test("searchOrgHierarkiaWithName returns the only org in hierarkia as its child's name matches the given name", () => {
  const hierarkia = [
    {
      oid: '1.2.246.562.10.353744225710',
      parentOids: ['1.2.246.562.10.353744225710', '1.2.246.562.10.00000000001'],
      nimi: {
        fi: 'Kansanvalistusseura sr',
        sv: 'Kansanvalistusseura sr',
        en: 'Kansanvalistusseura sr',
      },
      kotipaikkaUri: 'kunta_091',
      children: [
        {
          oid: '1.2.246.562.10.92541507692',
          parentOids: [
            '1.2.246.562.10.92541507692',
            '1.2.246.562.10.353744225710',
            '1.2.246.562.10.00000000001',
          ],

          oppilaitostyyppi: 'oppilaitostyyppi_64#1',
          nimi: {
            fi: 'Etelä-Helsingin kansalaisopisto',
            sv: 'Etelä-Helsingin kansalaisopisto',
            en: 'Etelä-Helsingin kansalaisopisto',
          },
          kotipaikkaUri: 'kunta_091',
          children: [],
          organisaatiotyypit: ['organisaatiotyyppi_02'],
          tyypit: [],
        },
      ],
      organisaatiotyypit: ['organisaatiotyyppi_01'],
      tyypit: [],
    },
    {
      oid: '1.2.246.562.10.501459103410',
      parentOids: ['1.2.246.562.10.501459103410', '1.2.246.562.10.00000000001'],
      nimi: {
        fi: 'Joku kaupunki',
        sv: 'Joku kaupunki',
        en: 'Joku kaupunki',
      },
      kotipaikkaUri: 'kunta_208',
      children: [
        {
          oid: '1.2.246.562.10.58311582298',
          parentOids: [
            '1.2.246.562.10.58311582298',
            '1.2.246.562.10.501459103410',
            '1.2.246.562.10.00000000001',
          ],
          oppilaitostyyppi: 'oppilaitostyyppi_64#1',
          nimi: {
            fi: 'Eriniminen kansalaisopisto',
            sv: 'Eriniminen kansalaisopisto',
            en: 'Eriniminen kansalaisopisto',
          },
          kotipaikkaUri: 'kunta_208',
          children: [
            {
              oid: '1.2.246.562.10.583115822981',
              parentOids: [
                '1.2.246.562.10.58311582298',
                '1.2.246.562.10.501459103410',
                '1.2.246.562.10.00000000001',
              ],
              oppilaitostyyppi: 'oppilaitostyyppi_64#1',
              nimi: {
                fi: 'Lapsenlapsiopisto',
                sv: 'Lapsenlapsiopisto',
                en: 'Lapsenlapsiopisto',
              },
              kotipaikkaUri: 'kunta_208',
              children: [],
              organisaatiotyypit: ['organisaatiotyyppi_02'],
              tyypit: [],
            },
            {
              oid: '1.2.246.562.10.58311582299',
              parentOids: [
                '1.2.246.562.10.58311582299',
                '1.2.246.562.10.501459103410',
                '1.2.246.562.10.00000000001',
              ],

              oppilaitostyyppi: 'oppilaitostyyppi_64#1',
              nimi: {
                fi: 'Lapsiopisto',
                sv: 'Lapsiopisto',
                en: 'Lapsiopisto',
              },
              kotipaikkaUri: 'kunta_208',
              children: [],
              organisaatiotyypit: ['organisaatiotyyppi_02'],
              tyypit: [],
            },
          ],
          organisaatiotyypit: ['organisaatiotyyppi_02'],
          tyypit: [],
        },
      ],
      organisaatiotyypit: [
        'organisaatiotyyppi_01',
        'organisaatiotyyppi_07',
        'organisaatiotyyppi_09',
      ],
      tyypit: [],
    },
  ];

  expect(searchOrgsFromHierarkiaWithName(hierarkia, 'laps')).toEqual([
    hierarkia[1],
  ]);
});
