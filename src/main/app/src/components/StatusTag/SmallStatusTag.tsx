import React from 'react';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Flex } from '#/src/components/Flex';
import { Typography } from '#/src/components/virkailija';
import { getJulkaisutilaTranslationKey } from '#/src/constants';
import { spacing } from '#/src/theme';

import { getColor, StatusTagProps } from './utils';

const Badge = styled.div`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 3px;
  background-color: ${getColor};
  margin-right: ${spacing(1)};
`;

const getLabel = ({ children, tila, t }) => {
  if (children) {
    return children;
  }

  return t(getJulkaisutilaTranslationKey(tila));
};

export const SmallStatusTag = ({
  children,
  status,
  color,
  ...props
}: StatusTagProps) => {
  const { t } = useTranslation();

  return (
    <Flex inline alignCenter {...props}>
      <Badge status={status} color={color} />
      <Typography>{getLabel({ children, tila: status, t })}</Typography>
    </Flex>
  );
};

export default SmallStatusTag;
