import React from 'react';
import styled from 'styled-components';

import { InputBase } from '../Input';

const SelectBase = styled(InputBase).attrs({ as: 'select' })`
  height: calc(2.25rem + 2px);
`;

export const Option = styled.option`
  padding: 6px 12px;
`;

export const NativeSelect = ({ ...props }) => {
  return <SelectBase {...props} />;
};

export default NativeSelect;
