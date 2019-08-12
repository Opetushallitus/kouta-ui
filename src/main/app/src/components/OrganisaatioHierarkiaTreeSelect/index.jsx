import React, { useCallback } from 'react';

import useLanguage from '../useLanguage';
import { getFirstLanguageValue } from '../../utils';
import TreeSelect from '../TreeSelect';

const getValue = ({ oid }) => oid;

const OrganisaatioHierarkiaTreeSelect = ({ hierarkia, ...props }) => {
  const language = useLanguage();

  const getLabel = useCallback(
    ({ nimi }) => getFirstLanguageValue(nimi, language),
    [language],
  );

  return (
    <TreeSelect
      options={hierarkia}
      getLabel={getLabel}
      getValue={getValue}
      {...props}
    />
  );
};

export default OrganisaatioHierarkiaTreeSelect;
