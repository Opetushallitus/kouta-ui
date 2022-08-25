import { useKoulutusByKoodi } from "#/src/utils/koulutus/getKoulutusByKoodi";

const isAmmatillinenPerustutkinto = koulutus => {
  const koulutustyyppiKoodit = koulutus.koulutuksetKoodiUri.map(koodiUri => {
    const {data: koulutusByKoodiUri} = useKoulutusByKoodi({koodiUri: koodiUri})
    return koulutusByKoodiUri?.koulutustyyppiKoodit
  });
  return koulutustyyppiKoodit?.flat().includes('koulutustyyppi_1')
};

export default isAmmatillinenPerustutkinto;