import React, { useCallback, useMemo } from 'react';

import { TreeSelect } from '#/src/components/virkailija';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import sortTreeBy from '#/src/utils/sortTreeBy';

const getValue = ({ oid }) => oid;

const OrganisaatioHierarkiaTreeSelect = ({ hierarkia, ...props }) => {
  const language = useUserLanguage();

  const getLabel = useCallback(
    ({ nimi }) => getFirstLanguageValue(nimi, language),
    [language]
  );

  const sortedHierarkia = useMemo(() => sortTreeBy(hierarkia, getLabel), [
    getLabel,
    hierarkia,
  ]);

  return (
    <TreeSelect
      options={sortedHierarkia}
      getLabel={getLabel}
      getValue={getValue}
      {...props}
    />
  );
};

export default OrganisaatioHierarkiaTreeSelect;
