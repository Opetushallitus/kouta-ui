export default ({ koodisto, koodiCount = 5, versio = 1 }) => {
  return [...new Array(koodiCount)].map((v, index) => ({
    koodiUri: `${koodisto}_${index}`,
    resourceUri: `https://virkailija.hahtuvaopintopolku.fi/koodisto-service/rest/codeelement/${koodisto}_11`,
    version: versio,
    versio: versio,
    koodisto: {
      koodistoUri: koodisto,
      organisaatioOid: '1.2.246.562.10.00000000001',
      koodistoVersios: [versio],
    },
    koodiArvo: index.toString(),
    paivitysPvm: 1427461978048,
    voimassaAlkuPvm: '2000-01-01',
    voimassaLoppuPvm: null,
    tila: 'LUONNOS',
    metadata: ['fi', 'sv', 'en'].map(language => ({
      nimi: `${koodisto}_${index}`,
      kuvaus: `${koodisto}_${index}`,
      lyhytNimi: `${koodisto}_${index}`,
      kieli: language,
    })),
  }));
};
