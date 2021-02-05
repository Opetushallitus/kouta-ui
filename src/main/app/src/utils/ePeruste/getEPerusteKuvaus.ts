import _ from 'lodash';

import { LANGUAGES } from '#/src/constants';
import { sanitizeHTML } from '#/src/utils';

const addSection = (heading, content) => `<h6>${heading}</h6>${content}`;

export default function getEPerusteKuvausHTML(ePeruste, i18n) {
  const TRANSLATORS = _.transform(
    LANGUAGES,
    (result, lang) => (result[lang] = i18n.getFixedT(lang)),
    {}
  );

  const {
    kuvaus,
    tyotehtavatJoissaVoiToimia,
    suorittaneenOsaaminen,
  } = ePeruste;

  if (tyotehtavatJoissaVoiToimia && suorittaneenOsaaminen) {
    return _.mapValues(TRANSLATORS, (t, lang) =>
      sanitizeHTML(
        `${addSection(
          t('eperuste.suorittaneenOsaaminen'),
          _.get(suorittaneenOsaaminen, lang) || '-'
        )}${addSection(
          t('eperuste.tyotehtavatJoissaVoiToimia'),
          _.get(tyotehtavatJoissaVoiToimia, lang) || '-'
        )}`
      )
    );
  } else if (kuvaus) {
    return _.mapValues(kuvaus, sanitizeHTML);
  }
}
