import { get, mapValues, transform } from 'lodash';

import { LANGUAGES } from '#/src/constants';
import { sanitizeHTML } from '#/src/utils';

const addSection = (heading, content) => `<h6>${heading}</h6>${content}`;

export default function getEPerusteKuvausHTML(ePeruste, i18n) {
  const TRANSLATORS = transform(
    LANGUAGES,
    (result, lang) => (result[lang] = i18n.getFixedT(lang)),
    {}
  );

  const { kuvaus, tyotehtavatJoissaVoiToimia, suorittaneenOsaaminen } =
    ePeruste;

  if (tyotehtavatJoissaVoiToimia && suorittaneenOsaaminen) {
    return mapValues(TRANSLATORS, (t, lang) =>
      sanitizeHTML(
        `${addSection(
          t('eperuste.suorittaneenOsaaminen'),
          get(suorittaneenOsaaminen, lang) || '-'
        )}${addSection(
          t('eperuste.tyotehtavatJoissaVoiToimia'),
          get(tyotehtavatJoissaVoiToimia, lang) || '-'
        )}`
      )
    );
  } else if (kuvaus) {
    return mapValues(kuvaus, sanitizeHTML);
  }
}
