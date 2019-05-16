import React from 'react';
import styled, { css } from 'styled-components';

import useTranslation from '../useTranslation';
import { spacing, getThemeProp } from '../../theme';
import Flex, { FlexItem } from '../Flex';
import Button from '../Button';

const Item = styled.div`
  ${({ isFirst }) =>
    !isFirst &&
    css`
      padding-top: ${spacing(4)};
    `}

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

export const FieldArrayList = ({
  fields,
  hasDivider = true,
  hasRemoveButton = true,
  removeButtonText: removeButtonTextProp,
  children = () => null,
}) => {
  const { t } = useTranslation();
  const removeButtonText = removeButtonTextProp || t('yleiset.poista');

  const fieldsContent = fields.map((field, index, f) => {
    const isLast = index === fields.length - 1;
    const isFirst = index === 0;
    const itemHasDivider = hasDivider;

    return (
      <Item
        isLast={isLast}
        isFirst={isFirst}
        key={index}
        hasDivider={itemHasDivider}
      >
        <Flex>
          <FlexItem grow={1}>{children({ field, index, fields: f })}</FlexItem>
          {hasRemoveButton ? (
            <FlexItem grow={0} paddingLeft={4}>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={() => fields.remove(index)}
              >
                {removeButtonText}
              </Button>
            </FlexItem>
          ) : null}
        </Flex>
      </Item>
    );
  });

  return fieldsContent;
};

export default FieldArrayList;
