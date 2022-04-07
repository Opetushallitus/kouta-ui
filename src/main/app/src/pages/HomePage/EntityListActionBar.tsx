import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import IconButton from '#/src/components/IconButton';
import { Box } from '#/src/components/virkailija';
import { getThemeProp, spacing } from '#/src/theme';

const ButtonBox = styled(Box)`
  display: flex;
  background-color: ${getThemeProp('palette.primary.main')};
  color: white;
  padding: ${spacing(1)};
  align-items: center;
  border-radius: 3px;
`;

const ActionButton = styled(IconButton).attrs({ variant: 'text' })`
  color: white;
  padding: 8px;
  &:hover {
    color: white;
    background-color: #006a8a;
  }
`;

const VerticalSeparator = styled(Box).attrs({ marginLeft: 2, marginRight: 2 })`
  display: block;
  height: auto;
  width: px;
  border-left: 1px solid #00526c;
  padding: 0;
  align-self: stretch;
`;

export const EntityListActionBar = ({
  entityType,
  selection,
  removeSelection,
  copyEntities,
}) => {
  const { t } = useTranslation();
  const isDisabled = _.size(selection) === 0;

  return (
    <ButtonBox display="flex">
      <Box padding={1}>
        {t(`etusivu.${entityType}.valitut`, { count: _.size(selection) })}
      </Box>
      <VerticalSeparator />
      <ActionButton
        iconType="deselect"
        variant="text"
        onClick={removeSelection}
        disabled={isDisabled}
      >
        {t('etusivu.poistaValinta')}
      </ActionButton>
      <VerticalSeparator />
      <ActionButton
        iconType="file_copy"
        variant="text"
        onClick={copyEntities}
        disabled={isDisabled}
      >
        {t('etusivu.kopioi')}
      </ActionButton>
    </ButtonBox>
  );
};
