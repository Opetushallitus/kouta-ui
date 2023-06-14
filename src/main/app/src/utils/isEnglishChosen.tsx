import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

export const isEnglishChosen = (opetuskielet: Array<string> = []) => {
  return opetuskielet.some(kieli => {
    const { koodisto, koodiArvo } = parseKoodiUri(kieli);
    return koodisto === 'oppilaitoksenopetuskieli' && koodiArvo === '4';
  });
};
