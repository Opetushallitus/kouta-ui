import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Flex, FlexItem } from '#/src/components/Flex';
import Select from '#/src/components/Select';
import { Checkbox, Input, InputIcon } from '#/src/components/virkailija';
import { getJulkaisutilaTranslationKey, JULKAISUTILA } from '#/src/constants';

const getDefaultOptions = t => [
  {
    value: JULKAISUTILA.JULKAISTU,
    label: t(getJulkaisutilaTranslationKey(JULKAISUTILA.JULKAISTU)),
  },
  {
    value: JULKAISUTILA.TALLENNETTU,
    label: t(getJulkaisutilaTranslationKey(JULKAISUTILA.TALLENNETTU)),
  },
  {
    value: JULKAISUTILA.ARKISTOITU,
    label: t(getJulkaisutilaTranslationKey(JULKAISUTILA.ARKISTOITU)),
  },
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
    [onTilaChangeArg]
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
          suffix={<InputIcon type="search" />}
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
      {/* TODO: Hide this if any tila is chosen */}
      <FlexItem grow={0}>
        <Checkbox checked={showArchived} onChange={onShowArchivedChange}>
          {t('etusivu.naytaArkistoidut')}
        </Checkbox>
      </FlexItem>
    </Flex>
  );
};

export default Filters;
