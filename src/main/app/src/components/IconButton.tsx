import React from 'react';

import Icon from '@opetushallitus/virkailija-ui-components/Icon';
import styled from 'styled-components';

import Button from '#/src/components/Button';

const SizedIcon = styled(Icon)`
  font-size: 1.2em;
  width: 1.1em;
  padding-right: 2px;
`;

export const IconButton = ({ iconType, children, ...props }) => (
  <Button {...props}>
    <SizedIcon type={iconType} />
    {children}
  </Button>
);

export default IconButton;
