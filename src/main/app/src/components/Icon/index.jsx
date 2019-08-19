import React from 'react';
import styled from 'styled-components';

import { color, space, typography } from '../../system';

const IconBase = styled.i`
  font-size: 1.5rem;

  ${color};
  ${space};
  ${typography};
`;

const Icon = React.forwardRef(({ type, className = '', ...props }, ref) => {
  const iconClassName = `material-icons ${className}`;

  return (
    <IconBase ref={ref} className={iconClassName} {...props}>
      {type}
    </IconBase>
  );
});

export default Icon;
