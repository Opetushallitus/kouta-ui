import React, { useCallback, useMemo } from 'react';

import Flex, { FlexItem } from '../Flex';
import Input, { AddonIcon } from '../Input';
import Checkbox from '../Checkbox';
import Select from '../Select';
import { JULKAISUTILA } from '../../constants';
import useTranslation from '../useTranslation';

const getDefaultOptions = t => [
  { value: JULKAISUTILA.JULKAISTU, label: t('yleiset.julkaistu') },
  { value: JULKAISUTILA.TALLENNETTU, label: t('yleiset.tallennettu') },
  { value: JULKAISUTILA.ARKISTOITU, label: t('yleiset.arkistoitu') },
];

export const Filters = ({
  nimi,
  onNimiChange,
  showArchived,
  onShowArchivedChange,
  onTilaChange: onTilaChangeArg,
  nimiPlaceholder = '',
  tilaOptions: tilaOptionsProp,
}) => {
  const { t } = useTranslation();

  const onTilaChange = useCallback(
    value => {
      onTilaChangeArg(value);
    },
    [onTilaChangeArg],
  );

  const tilaOptions = useMemo(() => tilaOptionsProp || getDefaultOptions(t), [
    t,
    tilaOptionsProp,
  ]);

  return (
    <Flex alignCenter>
      <FlexItem grow={1} paddingRight={2}>
        <Input
          placeholder={nimiPlaceholder}
          value={nimi}
          onChange={onNimiChange}
          addonAfter={<AddonIcon type="search" />}
        />
      </FlexItem>
      <FlexItem grow={0} basis="20%" paddingRight={2}>
        <Select
          options={tilaOptions}
          onChange={onTilaChange}
          placeholder={t('yleiset.tila')}
          isClearable
        />
      </FlexItem>
      <FlexItem grow={0}>
        <Checkbox checked={showArchived} onChange={onShowArchivedChange}>
          {t('etusivu.naytaArkistoidut')}
        </Checkbox>
      </FlexItem>
    </Flex>
  );
};

export default Filters;
