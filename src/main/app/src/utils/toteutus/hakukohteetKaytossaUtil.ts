import { HakukohteetToteutuksella, Koulutustyyppi } from '#/src/constants';
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

export const isHakukohteetKaytossa = (
  isHakukohteetKaytossaS: string | null | undefined
) => {
  return isHakukohteetKaytossaS === HakukohteetToteutuksella.EI_HAKUKOHTEITA ||
    isHakukohteetKaytossaS === HakukohteetToteutuksella.HAKUKOHTEET_KAYTOSSA
    ? JSON.parse(isHakukohteetKaytossaS)
    : undefined;
};
