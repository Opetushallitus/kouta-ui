const createOidGenerator = rootOid => {
  const [firstStr, ...rest] = rootOid.split('.');

  let first = parseInt(firstStr);

  return () => {
    first = first + 1;

    return [first, ...rest].join('.');
  };
};

export default ({ rootOid = '1.1.1.1.1.1', rootName = 'Organisaatio' }) => {
  return {
    numHits: 1,
    organisaatiot: [
      {
        oid: rootOid,
        nimi: { fi: `${rootName}_1` },
        organisaatiotyypit: ['organisaatiotyyppi_01'],
        parentOidPath: rootOid,
        children: [
          {
            nimi: { fi: `${rootName}_1_1` },
            oid: '1.2.1.1.1.1',
            organisaatiotyypit: ['organisaatiotyyppi_02'],
            parentOidPath: `${rootOid}/1.2.1.1.1.1`,
            children: [
              {
                nimi: { fi: `${rootName}_1_1_1` },
                oid: '1.2.2.1.1.1',
                organisaatiotyypit: ['organisaatiotyyppi_03'],
                parentOidPath: `${rootOid}/1.2.1.1.1.1/1.2.2.1.1.1`,
              },
            ],
          },
          {
            nimi: { fi: `${rootName}_1_2` },
            oid: '1.3.1.1.1.1',
            organisaatiotyypit: ['organisaatiotyyppi_02'],
            parentOidPath: `${rootOid}/1.3.1.1.1.1`,
            children: [
              {
                nimi: { fi: `${rootName}_1_2_1` },
                oid: '1.3.2.1.1.1',
                organisaatiotyypit: ['organisaatiotyyppi_03'],
                parentOidPath: `${rootOid}/1.3.1.1.1.1/1.3.2.1.1.1`,
              },
            ],
          },
        ],
      },
    ],
  };
};
