import React, { useCallback, useMemo } from 'react';

import type { TreeSelectProps } from '@opetushallitus/virkailija-ui-components/TreeSelect';

import { TreeSelect } from '#/src/components/virkailija';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { OrganisaatioModel } from '#/src/types/domainTypes';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import sortTreeBy from '#/src/utils/sortTreeBy';

type Props = Omit<
  TreeSelectProps<OrganisaatioModel>,
  'options' | 'getLabel' | 'getValue'
> & {
  hierarkia: Array<OrganisaatioModel>;
};

const getValue = ({ oid }: OrganisaatioModel): string => oid;

const OrganisaatioHierarkiaTreeSelect = ({ hierarkia, ...props }: Props) => {
  const language = useUserLanguage();

  const getLabel = useCallback(
    ({ nimi }: OrganisaatioModel) => getFirstLanguageValue(nimi, language),
    [language]
  );

  const sortedHierarkia = useMemo(
    () => sortTreeBy(hierarkia, getLabel),
    [getLabel, hierarkia]
  );

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
