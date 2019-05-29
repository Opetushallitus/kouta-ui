const createOidGenerator = rootOid => {
  const [firstStr, ...rest] = rootOid.split('.');

  let first = parseInt(firstStr);

  return () => {
    first = first + 1;

    return [first, ...rest].join('.');
  };
};

export default ({ rootOid = '1.1.1.1.1.1', rootName = 'Organisaatio' }) => {
  const nextOid = createOidGenerator(rootOid);

  return {
    numHits: 1,
    organisaatiot: [
      {
        oid: rootOid,
        nimi: { fi: `${rootName}_1` },
        organisaatiotyypit: ['organisaatiotyyppi_01'],
        parentOidPath: '1.2.246.562.10.00000000001',
        children: [
          {
            nimi: { fi: `${rootName}_1_1` },
            oid: nextOid(),
            organisaatiotyypit: ['organisaatiotyyppi_02'],
            parentOidPath: '1.2.246.562.10.00000000001',
            children: [
              {
                nimi: { fi: `${rootName}_1_1_1` },
                oid: nextOid(),
                organisaatiotyypit: ['organisaatiotyyppi_03'],
                parentOidPath: '1.2.246.562.10.00000000001',
              },
            ],
          },
          {
            nimi: { fi: `${rootName}_1_2` },
            oid: nextOid(),
            organisaatiotyypit: ['organisaatiotyyppi_02'],
            parentOidPath: '1.2.246.562.10.00000000001',
            children: [
              {
                nimi: { fi: `${rootName}_1_2_1` },
                oid: nextOid(),
                organisaatiotyypit: ['organisaatiotyyppi_03'],
                parentOidPath: '1.2.246.562.10.00000000001',
              },
            ],
          },
        ],
      },
    ],
  };
};
