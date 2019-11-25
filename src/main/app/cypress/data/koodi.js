export default ({ koodisto, koodiArvo = '0', versio = 1 }) => {
  const koodiUri = `${koodisto}_${koodiArvo}`;

  return {
    koodiUri,
    resourceUri: `https://virkailija.hahtuvaopintopolku.fi/koodisto-service/rest/codeelement/${koodisto}_${koodiArvo}/${versio}`,
    version: versio,
    versio: versio,
    koodisto: {
      koodistoUri: koodisto,
      organisaatioOid: '1.2.246.562.10.00000000001',
      koodistoVersios: [versio],
    },
    koodiArvo: koodiArvo,
    paivitysPvm: 1427461978048,
    voimassaAlkuPvm: '2000-01-01',
    voimassaLoppuPvm: null,
    tila: 'LUONNOS',
    metadata: ['fi', 'sv', 'en'].map(language => ({
      nimi: koodiUri,
      kuvaus: koodiUri,
      lyhytNimi: koodiUri,
      kieli: language,
    })),
  };
};
