import React from 'react';
import styled from 'styled-components';
import get from 'lodash/get';

import Flex from '../Flex';
import { spacing } from '../../theme';
import Typography from '../Typography';
import { JULKAISUTILA } from '../../constants';

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

const labelByTila = {
  [JULKAISUTILA.JULKAISTU]: 'Julkaistu',
  [JULKAISUTILA.TALLENNETTU]: 'Tallennettu',
  [JULKAISUTILA.ARKISTOITU]: 'Arkistoitu',
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

const getLabel = ({ children, tila }) => {
  if (children) {
    return children;
  }

  if (tila && labelByTila[tila]) {
    return labelByTila[tila];
  }

  return null;
};

const TilaLabel = ({ children, color, tila, ...props }) => (
  <Flex inline alignCenter>
    <Badge color={getColor({ tila, color })} />
    <Typography>{getLabel({ children, tila })}</Typography>
  </Flex>
);

export default TilaLabel;
