import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import FormHelperTextMulti from '#/src/components/FormHelperTextMulti';
import RemoveButton from '#/src/components/RemoveButton';
import { Box, FormControl } from '#/src/components/virkailija';
import { spacing, getThemeProp } from '#/src/theme';

const Item = styled.div`
  padding-bottom: ${spacing(4)};

  ${({ isLast, hasDivider }) =>
    isLast &&
    !hasDivider &&
    css`
      padding-bottom: 0px;
    `}

  ${({ hasDivider }) =>
    hasDivider &&
    css`
      border-bottom: 1px solid ${getThemeProp('palette.divider')};
    `}
`;

const ItemFlex = styled(Box)`
  max-width: 100%;
  min-width: 0;
`;

export const FieldArrayList = ({
  fields,
  meta,
  hasDivider = true,
  hasRemoveButton = true,
  removeButtonText: removeButtonTextProp,
  children,
}) => {
  const { t } = useTranslation();
  const removeButtonText = removeButtonTextProp || t('yleiset.poista');
  const error = _.get(meta, 'error');

  const fieldsContent = fields.map((field, index, f) => {
    return (
      <Item
        isFirst={index === 0}
        isLast={index === fields.length - 1}
        key={index}
        hasDivider={hasDivider}
      >
        <Box display="flex">
          <ItemFlex flexGrow={1}>
            {children({ field, index, fields: f })}
          </ItemFlex>
          {hasRemoveButton ? (
            <Box flexGrow={0} paddingLeft={4} marginTop={4}>
              <RemoveButton onClick={() => fields.remove(index)}>
                {removeButtonText}
              </RemoveButton>
            </Box>
          ) : null}
        </Box>
      </Item>
    );
  });

  return (
    <FormControl
      error={!_.isNil(error)}
      helperText={<FormHelperTextMulti errorMessage={error} />}
    >
      {fieldsContent}
    </FormControl>
  );
};

export default FieldArrayList;
