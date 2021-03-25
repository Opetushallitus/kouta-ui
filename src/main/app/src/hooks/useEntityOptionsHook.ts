import { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { getJulkaisutilaTranslationKey, JULKAISUTILA } from '#/src/constants';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

interface EntityForDropdown {
  nimi: Record<LanguageCode, string>;
  tila: JULKAISUTILA;
  id?: string;
  oid?: string;
}

export const useEntityOptions = entities => {
  const language = useUserLanguage();
  const { t } = useTranslation();

  return useMemo(
    () =>
      _fp.isArray(entities)
        ? _fp.flow(
            _fp.map((entity: EntityForDropdown) => ({
              value: entity.id ?? entity.oid,
              label:
                getFirstLanguageValue(entity.nimi, language) +
                ` (${t(getJulkaisutilaTranslationKey(entity.tila))})`,
            })),
            _fp.orderBy(({ label }) => _fp.lowerCase(label), 'asc')
          )(entities as Array<EntityForDropdown>)
        : [],
    [entities, language, t]
  );
};

export default useEntityOptions;
