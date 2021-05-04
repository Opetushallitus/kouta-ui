import { useMemo } from 'react';

import _fp from 'lodash/fp';
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
      _fp.isArray(entities)
        ? _fp.flow(
            _fp.map((entity: EntityForDropdown<T>) => ({
              value: entity.id ?? entity.oid,
              label:
                getFirstLanguageValue(entity.nimi, language) +
                ` (${t(getJulkaisutilaTranslationKey(entity.tila))})` +
                suffixFn?.(entity),
            })),
            _fp.orderBy(({ label }) => _fp.lowerCase(label), 'asc')
          )(entities as Array<EntityForDropdown<T>>)
        : ([] as Array<any>),
    [entities, language, suffixFn, t]
  );
};

export default useEntityOptions;
