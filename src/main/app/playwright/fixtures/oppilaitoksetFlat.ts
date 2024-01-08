import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

export default ({
  rootOid = '1.1.1.1.1.1',
  rootName = 'Organisaatio',
} = {}) => {
  return {
    organisaatiot: [
      {
        nimi: { fi: `${rootName}_1_1` },
        oid: '1.2.1.1.1.1',
        organisaatiotyypit: ['organisaatiotyyppi_02'],
        parentOid: rootOid,
        parentOids: ['1.2.1.1.1.1', rootOid, OPETUSHALLITUS_ORGANISAATIO_OID],
        children: [],
      },
      {
        nimi: { fi: `${rootName}_1_2` },
        oid: '1.3.1.1.1.1',
        organisaatiotyypit: ['organisaatiotyyppi_02'],
        parentOid: rootOid,
        parentOids: ['1.3.1.1.1.1', rootOid, OPETUSHALLITUS_ORGANISAATIO_OID],
        children: [],
      },
    ],
  };
};
