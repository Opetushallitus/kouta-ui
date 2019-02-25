import React, { useCallback } from 'react';

import Flex, { FlexItem } from '../Flex';
import Input from '../Input';
import Checkbox from '../Checkbox';
import Select from '../Select';
import { JULKAISUTILA } from '../../constants';

const defaultTilaOptions = [
  { value: JULKAISUTILA.JULKAISTU, label: 'Julkaistu' },
  { value: JULKAISUTILA.TALLENNETTU, label: 'Tallennettu' },
  { value: JULKAISUTILA.ARKISTOITU, label: 'Arkistoitu' },
];

export const Filters = ({
  nimi,
  onNimiChange,
  showArchived,
  onShowArchivedChange,
  onTilaChange: onTilaChangeArg,
  nimiPlaceholder = '',
  tilaOptions = defaultTilaOptions
}) => {
  const onTilaChange = useCallback(value => {
    onTilaChangeArg(value);
  }, [onTilaChangeArg]);

  return (
    <Flex alignCenter>
      <FlexItem grow={1} paddingRight={2}>
        <Input
          placeholder={nimiPlaceholder}
          value={nimi}
          onChange={onNimiChange}
        />
      </FlexItem>
      <FlexItem grow={0} basis="20%" paddingRight={2}>
        <Select options={tilaOptions} onChange={onTilaChange} placeholder="Tila" isClearable />
      </FlexItem>
      <FlexItem grow={0}>
        <Checkbox checked={showArchived} onChange={onShowArchivedChange}>
          Näytä myös arkistoidut
        </Checkbox>
      </FlexItem>
    </Flex>
  );
};

export default Filters;
