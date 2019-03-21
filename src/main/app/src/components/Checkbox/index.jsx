import React from 'react';
import styled from 'styled-components';

import { getThemeProp } from '../../theme';

const Label = styled.label`
  font-family: ${getThemeProp('typography.fontFamily')};
  font-size: 1rem;
  display: flex;
  line-height: 1.5;
  color: ${getThemeProp('palette.text.primary')};
`;

const LabelWrapper = styled.div`
  flex: 1;
  margin-left: 6px;
`;

const CheckboxWrapper = styled.div`
  flex: 0;
`;

const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  font-size: inherit;
`;

const Checkbox = ({ children = null, ...props }) => {
  return (
    <Label>
      <CheckboxWrapper>
        <CheckboxInput {...props} />
      </CheckboxWrapper>
      <LabelWrapper>{children}</LabelWrapper>
    </Label>
  );
}

export default Checkbox;
