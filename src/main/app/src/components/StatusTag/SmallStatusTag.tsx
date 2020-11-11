import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';

import Flex from '#/src/components/Flex';
import { spacing } from '#/src/theme';
import { Typography } from '#/src/components/virkailija';
import { getJulkaisutilaTranslationKey, JULKAISUTILA } from '#/src/constants';

import { useTranslation } from 'react-i18next';

const Badge = styled.div`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 3px;
  background-color: ${({ theme, color }) =>
    get(theme, ['colors', color]) || theme.colors.tallennettu};
  margin-right: ${spacing(1)};
`;

const colorByTila = {
  [JULKAISUTILA.JULKAISTU]: 'julkaistu',
  [JULKAISUTILA.TALLENNETTU]: 'tallennettu',
  [JULKAISUTILA.ARKISTOITU]: 'arkistoitu',
};

const getColor = ({ tila, color }) => {
  if (color) {
    return color;
  }

  if (tila && colorByTila[tila]) {
    return colorByTila[tila];
  }

  return 'tallennettu';
};

const getLabel = ({ children, tila, t }) => {
  if (children) {
    return children;
  }

  return t(getJulkaisutilaTranslationKey(tila));
};

const SmallStatusTag = ({ children, status, color, ...props }) => {
  const { t } = useTranslation();

  return (
    <Flex inline alignCenter {...props}>
      <Badge color={getColor({ tila: status, color })} />
      <Typography>{getLabel({ children, tila: status, t })}</Typography>
    </Flex>
  );
};

export default SmallStatusTag;
