import React from 'react';
import styled from 'styled-components';
import get from 'lodash/get';

import Flex from '../Flex';
import { spacing } from '../../theme';
import Typography from '../Typography';
import { JULKAISUTILA } from '../../constants';

import useTranslation from '../useTranslation';

const Badge = styled.div`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 3px;
  background-color: ${({ theme, color }) =>
    get(theme, ['palette', color, 'main']) || theme.primary.main};
  margin-right: ${spacing(1)};
`;

const colorByTila = {
  [JULKAISUTILA.JULKAISTU]: 'success',
  [JULKAISUTILA.TALLENNETTU]: 'primary',
  [JULKAISUTILA.ARKISTOITU]: 'orange',
};

const getColor = ({ tila, color }) => {
  if (color) {
    return color;
  }

  if (tila && colorByTila[tila]) {
    return colorByTila[tila];
  }

  return 'primary';
};

const getLabel = ({ children, tila, t }) => {
  if (children) {
    return children;
  }

  return t(`yleiset.${tila}`);
};

const TilaLabel = ({ children, color, tila, ...props }) => {
  const { t } = useTranslation();

  return (
    <Flex inline alignCenter>
      <Badge color={getColor({ tila, color })} />
      <Typography>{getLabel({ children, tila, t })}</Typography>
    </Flex>
  );
};

export default TilaLabel;
