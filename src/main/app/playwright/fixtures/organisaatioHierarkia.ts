const OPH_OID = '1.2.246.562.10.00000000001';

export default ({
  rootOid = '1.1.1.1.1.1',
  rootName = 'Organisaatio',
  toimipistenimi = `${rootName}_1_1_1`,
  jarjestyspaikkaOid = '1.2.2.1.1.1',
} = {}) => {
  return {
    numHits: 1,
    organisaatiot: [
      {
        oid: rootOid,
        nimi: { fi: `${rootName}_1` },
        organisaatiotyypit: ['organisaatiotyyppi_01'],
        parentOid: OPH_OID,
        parentOidPath: `${rootOid}/${OPH_OID}`,
        children: [
          {
            nimi: { fi: `${rootName}_1_1` },
            oid: '1.2.1.1.1.1',
            organisaatiotyypit: ['organisaatiotyyppi_02'],
            parentOid: rootOid,
            parentOidPath: `1.2.1.1.1.1/${rootOid}/${OPH_OID}`,
            children: [
              {
                nimi: { fi: toimipistenimi },
                oid: jarjestyspaikkaOid,
                parentOid: '1.2.1.1.1.1',
                organisaatiotyypit: ['organisaatiotyyppi_03'],
                parentOidPath: `1.2.2.1.1.1/1.2.1.1.1.1/${rootOid}/${OPH_OID}`,
              },
            ],
          },
          {
            nimi: { fi: `${rootName}_1_2` },
            oid: '1.3.1.1.1.1',
            organisaatiotyypit: ['organisaatiotyyppi_02'],
            parentOid: rootOid,
            parentOidPath: `${rootOid}/1.3.1.1.1.1/${OPH_OID}`,
            children: [
              {
                nimi: { fi: `${rootName}_1_2_1` },
                oid: '1.3.2.1.1.1',
                organisaatiotyypit: ['organisaatiotyyppi_03'],
                parentOid: '1.3.1.1.1.1',
                parentOidPath: `1.3.2.1.1.1/1.3.1.1.1.1/${rootOid}/${OPH_OID}`,
              },
            ],
          },
        ],
      },
    ],
  };
};
