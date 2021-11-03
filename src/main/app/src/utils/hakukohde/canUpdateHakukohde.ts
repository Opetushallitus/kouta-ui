export const isHakukohteenTakarajaExpired = (now, takaraja) => {
  return now >= takaraja;
};

export const canUpdateHakukohde = (now, hakukohteenMuokkaamisenTakaraja) => {
  let canUpdateHakukohde = !isHakukohteenTakarajaExpired(
    now,
    hakukohteenMuokkaamisenTakaraja
  );

  return canUpdateHakukohde;
};

export const canCreateHakukohde = (now, hakukohteenLiittamisenTakaraja) => {
  let canUpdateHakukohde = !isHakukohteenTakarajaExpired(
    now,
    hakukohteenLiittamisenTakaraja
  );

  return canUpdateHakukohde;
};
