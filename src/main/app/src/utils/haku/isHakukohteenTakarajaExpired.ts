const isHakukohteenTakarajaExpired = (now, takaraja) => {
  return now >= takaraja;
};

export default isHakukohteenTakarajaExpired;
