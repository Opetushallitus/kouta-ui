import React from 'react';
import styled from 'styled-components';

import { color, space, typography } from '../../system';

const IconBase = styled.i`
  font-size: 1.5rem;

  ${color};
  ${space};
  ${typography};
`;

const Icon = ({ type, className = '', ...props }) => {
  const iconClassName = `material-icons ${className}`;

  return (
    <IconBase className={iconClassName} {...props}>
      {type}
    </IconBase>
  );
};

export default Icon;
