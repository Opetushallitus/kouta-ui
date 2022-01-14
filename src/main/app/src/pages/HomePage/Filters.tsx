import React, { useCallback, useMemo, useRef, useState } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import Select from '#/src/components/Select';
import { Box, Input, InputIcon } from '#/src/components/virkailija';
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

  const tilaOptions = useMemo(
    () => tilaOptionsProp || getDefaultOptions(t),
    [t, tilaOptionsProp]
  );

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
    <Box display="flex" alignItems="center">
      <Box flexGrow={1} paddingRight={2}>
        <Input
          placeholder={nimiPlaceholder}
          value={usedNimi}
          onChange={onNimiChangeDebounced}
          suffix={<InputIcon type="search" />}
        />
      </Box>
      <Box flexGrow={0} flexBasis="20%" paddingRight={2}>
        <Select
          options={tilaOptions}
          onChange={onTilaChange}
          placeholder={t('yleiset.tila')}
          isMultiSelect
          isClearable
        />
      </Box>
    </Box>
  );
};

export default Filters;
