import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';

export const isApurahaVisible = (maksullisuustyyppi: string) => {
  return maksullisuustyyppi === MaksullisuusTyyppi.LUKUVUOSIMAKSU;
};
