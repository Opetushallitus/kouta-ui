import React from 'react';
import styled from 'styled-components';

import Input from '../Input';

const SelectBase = styled(Input).attrs({ as: 'select' })`
  height: calc(2.25rem + 2px);
`;

export const Option = styled.option`
  padding: 6px 12px;
`;

export const Select = ({ value, ...props }) => {
  const children = React.Children.map(props.children, child => {
    const selected = value !== undefined && child.props.value === value;

    return React.cloneElement(child, { selected });
  });

  return <SelectBase {...props}>{children}</SelectBase>;
};

export default Select;
