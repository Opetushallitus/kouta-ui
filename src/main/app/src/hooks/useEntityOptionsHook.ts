import useLanguage from '#/src/hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import { getJulkaisutilaTranslationKey, JULKAISUTILA } from '#/src/constants';
import _ from 'lodash/fp';

interface EntityForDropdown {
  nimi: Record<LanguageCode, string>;
  tila: JULKAISUTILA;
  id?: string;
  oid?: string;
}

export const useEntityOptions = entities => {
  const language = useLanguage();
  const { t } = useTranslation();

  return useMemo(
    () =>
      _.isArray(entities)
        ? _.pipe(
            _.map((entity: EntityForDropdown) => ({
              value: entity.id ?? entity.oid,
              label:
                getFirstLanguageValue(entity.nimi, language) +
                ` (${t(getJulkaisutilaTranslationKey(entity.tila))})`,
            })),
            _.orderBy('label', 'asc')
          )(entities as EntityForDropdown[])
        : [],
    [entities, language, t]
  );
};

export default useEntityOptions;
