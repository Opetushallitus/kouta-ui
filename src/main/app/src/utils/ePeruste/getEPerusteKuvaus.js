import _ from 'lodash';
import { LANGUAGES } from '#/src/constants';
import { sanitizeHTML } from '#/src/utils';
import { getDefaultLocalisation } from '#/src/localisation';

const addSection = (heading, content) => `<h6>${heading}</h6>${content}`;

export default function getEPerusteKuvaus(ePeruste) {
  const i18next = getDefaultLocalisation();

  const TRANSLATORS = _.transform(
    LANGUAGES,
    (result, lang) => (result[lang] = i18next.getFixedT(lang)),
    {},
  );

  const {
    kuvaus,
    tyotehtavatJoissaVoiToimia,
    suorittaneenOsaaminen,
  } = ePeruste;

  if (tyotehtavatJoissaVoiToimia && suorittaneenOsaaminen) {
    return _.mapValues(TRANSLATORS, (t, lang) => {
      return sanitizeHTML(
        `${addSection(
          t('eperuste.suorittaneenOsaaminen'),
          _.get(suorittaneenOsaaminen, lang) || '-',
        )}${addSection(
          t('eperuste.tyotehtavatJoissaVoiToimia'),
          _.get(tyotehtavatJoissaVoiToimia, lang) || '-',
        )}`,
      );
    });
  } else {
    return _.mapValues(kuvaus, sanitizeHTML);
  }
}
