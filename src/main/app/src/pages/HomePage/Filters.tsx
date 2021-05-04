import React, { useCallback, useMemo, useRef, useState } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { Flex, FlexItem } from '#/src/components/Flex';
import Select from '#/src/components/Select';
import { Checkbox, Input, InputIcon } from '#/src/components/virkailija';
import { getJulkaisutilaTranslationKey, JULKAISUTILA } from '#/src/constants';

const NAME_INPUT_DEBOUNCE_TIME = 300;

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

  const [usedNimi, setUsedNimi] = useState(nimi);
  const debouncedNimiChange = useRef(
    _.debounce(value => onNimiChange(value), NAME_INPUT_DEBOUNCE_TIME)
  );
  const onNimiChangeDebounced = useCallback(e => {
    const value = e.target.value;
    setUsedNimi(value);
    debouncedNimiChange.current(value);
  }, []);

  return (
    <Flex alignCenter>
      <FlexItem grow={1} paddingRight={2}>
        <Input
          placeholder={nimiPlaceholder}
          value={usedNimi}
          onChange={onNimiChangeDebounced}
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
