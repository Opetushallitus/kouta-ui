import { Organisaatio } from '#/src/types/domainTypes';
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
        kieletUris: ['oppilaitoksenopetuskieli_1#2'],
        organisaatiotyyppiUris: ['organisaatiotyyppi_01'],
        parentOids: [rootOid, OPH_OID],
        children: [
          {
            nimi: { fi: `${rootName}_1_1` },
            oid: '1.2.1.1.1.1',
            kieletUris: ['oppilaitoksenopetuskieli_1#2'],
            organisaatiotyyppiUris: ['organisaatiotyyppi_02'],
            parentOids: ['1.2.1.1.1.1', rootOid, OPH_OID],
            children: [
              {
                nimi: { fi: toimipistenimi },
                oid: jarjestyspaikkaOid,
                organisaatiotyyppiUris: ['organisaatiotyyppi_03'],
                parentOids: ['1.2.2.1.1.1', '1.2.1.1.1.1', rootOid, OPH_OID],
              },
            ] as Array<Organisaatio>,
          },
          {
            nimi: { fi: `${rootName}_1_2` },
            oid: '1.3.1.1.1.1',
            kieletUris: ['oppilaitoksenopetuskieli_1#2'],
            organisaatiotyyppiUris: ['organisaatiotyyppi_02'],
            parentOids: [rootOid, '1.3.1.1.1.1', OPH_OID],
            children: [
              {
                nimi: { fi: `${rootName}_1_2_1` },
                oid: '1.3.2.1.1.1',
                organisaatiotyyppiUris: ['organisaatiotyyppi_03'],
                parentOids: ['1.3.2.1.1.1', '1.3.1.1.1.1', rootOid, OPH_OID],
              },
            ] as Array<Organisaatio>,
          },
        ] as Array<Organisaatio>,
      },
    ] as Array<Organisaatio>,
  };
};
