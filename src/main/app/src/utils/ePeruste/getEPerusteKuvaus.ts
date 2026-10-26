import type { TFunction, i18n as I18n } from 'i18next';
import { get, mapValues, transform } from 'lodash-es';

import { LANGUAGES } from '#/src/constants';
import { sanitizeHTML } from '#/src/utils';

type EPeruste = {
  kuvaus?: Record<string, string>;
  tyotehtavatJoissaVoiToimia?: Record<string, string>;
  suorittaneenOsaaminen?: Record<string, string>;
};

const addSection = (heading: string, content: string): string =>
  `<h6>${heading}</h6>${content}`;

export default function getEPerusteKuvausHTML(
  ePeruste: EPeruste,
  i18n: I18n
): Record<string, string> | undefined {
  const TRANSLATORS = transform<string, Record<string, TFunction>>(
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
