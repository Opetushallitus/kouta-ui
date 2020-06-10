import React from 'react';
import styled, { css } from 'styled-components';
import { get, isNil } from 'lodash';
import { useTranslation } from 'react-i18next';
import { spacing, getThemeProp } from '#/src/theme';
import Flex, { FlexItem } from '#/src/components/Flex';
import FormControl from '#/src/components/FormControl';
import FormHelperTextMulti from '#/src/components/FormHelperTextMulti';
import RemoveButton from '../RemoveButton';

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

const ItemFlex = styled(FlexItem)`
  max-width: 100%;
  min-width: 0;
`;

export const FieldArrayList = ({
  fields,
  meta,
  hasDivider = true,
  hasRemoveButton = true,
  removeButtonText: removeButtonTextProp,
  children = () => null,
}) => {
  const { t } = useTranslation();
  const removeButtonText = removeButtonTextProp || t('yleiset.poista');
  const error = get(meta, 'error');

  const fieldsContent = fields.map((field, index, f) => {
    return (
      <Item
        isFirst={index === 0}
        isLast={index === fields.length - 1}
        key={index}
        hasDivider={hasDivider}
      >
        <Flex>
          <ItemFlex grow={1}>{children({ field, index, fields: f })}</ItemFlex>
          {hasRemoveButton ? (
            <FlexItem grow={0} paddingLeft={4} marginTop={4}>
              <RemoveButton onClick={() => fields.remove(index)}>
                {removeButtonText}
              </RemoveButton>
            </FlexItem>
          ) : null}
        </Flex>
      </Item>
    );
  });

  return (
    <FormControl
      error={!isNil(error)}
      helperText={<FormHelperTextMulti errorMessage={error} />}
    >
      {fieldsContent}
    </FormControl>
  );
};

export default FieldArrayList;
