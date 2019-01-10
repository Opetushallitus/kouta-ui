import React from 'react';
import styled from 'styled-components';

const IconBase = styled.i`
  font-size: 1.5rem;
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
