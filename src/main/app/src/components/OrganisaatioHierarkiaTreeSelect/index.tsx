import React, { useCallback, useMemo } from 'react';
import useLanguage from '#/src/hooks/useLanguage';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import sortTreeBy from '#/src/utils/sortTreeBy';
import { TreeSelect } from '#/src/components/virkailija';

const getValue = ({ oid }) => oid;

const OrganisaatioHierarkiaTreeSelect = ({ hierarkia, ...props }) => {
  const language = useLanguage();

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
