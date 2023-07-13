import { Koulutustyyppi } from '#/src/constants';
import { KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA } from '#/src/pages/toteutus/ToteutusForm/ToteutusForm';

export const hakukohteidenKaytonVoiValita = (
  koulutustyyppi: Koulutustyyppi
) => {
  return KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA.includes(
    koulutustyyppi
  );
};

export const hakukohteetAinaKaytossaKoulutustyypille = (
  koulutustyyppi: Koulutustyyppi
) => {
  return !hakukohteidenKaytonVoiValita(koulutustyyppi);
};
