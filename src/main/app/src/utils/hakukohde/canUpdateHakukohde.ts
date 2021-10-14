import isHakukohteenTakarajaExpired from '#/src/utils/haku/isHakukohteenTakarajaExpired';

const canUpdateHakukohde = (
  hakukohteenLiittamisenTakaraja,
  hakukohteenMuokkaamisenTakaraja
) => {
  let canUpdateHakukohde = true;
  const now = new Date();
  if (hakukohteenLiittamisenTakaraja || hakukohteenMuokkaamisenTakaraja) {
    const liittamisenTakaraja = hakukohteenLiittamisenTakaraja
      ? new Date(hakukohteenLiittamisenTakaraja)
      : null;
    const muokkaamisenTakaraja = hakukohteenMuokkaamisenTakaraja
      ? new Date(hakukohteenMuokkaamisenTakaraja)
      : null;

    canUpdateHakukohde = liittamisenTakaraja
      ? !isHakukohteenTakarajaExpired(now, liittamisenTakaraja)
      : true && muokkaamisenTakaraja
      ? !isHakukohteenTakarajaExpired(now, muokkaamisenTakaraja)
      : true;
  }

  return canUpdateHakukohde;
};

export default canUpdateHakukohde;
