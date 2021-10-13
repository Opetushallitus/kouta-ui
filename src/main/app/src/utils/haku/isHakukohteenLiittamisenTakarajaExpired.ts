const isHakukohteenLiittamisenTakarajaExpired = (now, liittamisenTakaraja) => {
  return now >= liittamisenTakaraja;
};

export default isHakukohteenLiittamisenTakarajaExpired;
