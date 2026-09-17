import { useMemo } from 'react';

import { compact, flow, lowerCase, map, sortBy } from 'lodash-es';
import { useTranslation } from 'react-i18next';

import { getJulkaisutilaTranslationKey, JULKAISUTILA } from '#/src/constants';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

type EntityForDropdown<T> = {
  nimi: Record<LanguageCode, string>;
  tila: JULKAISUTILA;
  id?: string;
  oid?: string;
} & T;

export const useEntityOptions = <T>(
  entities,
  suffixFn?
): Array<{ label: string; value: string }> => {
  const language = useUserLanguage();
  const { t } = useTranslation();

  return useMemo(
    () =>
      Array.isArray(entities)
        ? flow(
            (arr: Array<EntityForDropdown<T>>) => compact(arr),
            arr =>
              map(arr, entity => ({
                value: entity.id ?? entity.oid,
                label:
                  getFirstLanguageValue(entity.nimi, language) +
                  ` (${t(getJulkaisutilaTranslationKey(entity.tila))})` +
                  (suffixFn?.(entity) ?? ''),
              })),
            arr => sortBy(arr, ({ label }) => lowerCase(label))
          )(entities as Array<EntityForDropdown<T>>)
        : ([] as Array<any>),
    [entities, language, suffixFn, t]
  );
};

export default useEntityOptions;
