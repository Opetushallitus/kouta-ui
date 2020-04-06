import _ from 'lodash';
import { sanitizeHTML } from '#/src/utils';
import { getDefaultLocalisation } from '#/src/localisation';

const addSection = (heading, content) =>
  sanitizeHTML(`<h3>${heading}</h3>${content}`);

export default function getEPerusteKuvaus(ePeruste) {
  const i18next = getDefaultLocalisation();

  const TRANSLATORS = {
    fi: i18next.getFixedT('fi'),
    sv: i18next.getFixedT('sv'),
    en: i18next.getFixedT('en'),
  };

  const {
    kuvaus,
    tyotehtavatJoissaVoiToimia,
    suorittaneenOsaaminen,
  } = ePeruste;

  if (tyotehtavatJoissaVoiToimia && suorittaneenOsaaminen) {
    return _.mapValues(
      TRANSLATORS,
      (t, lang) =>
        `${addSection(
          t('eperuste.suorittaneenOsaaminen'),
          _.get(suorittaneenOsaaminen, lang),
        )}${addSection(
          t('eperuste.tyotehtavatJoissaVoiToimia'),
          _.get(tyotehtavatJoissaVoiToimia, lang),
        )}`,
    );
  } else {
    return _.mapValues(kuvaus, sanitizeHTML);
  }
}
