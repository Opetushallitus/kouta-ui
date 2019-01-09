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

const RadioWrapper = styled.div`
  flex: 0;
`;

const Radio = ({ children = null, ...props }) => (
  <Label>
    <RadioWrapper>
      <input type="radio" {...props} />
    </RadioWrapper>
    <LabelWrapper>{children}</LabelWrapper>
  </Label>
);

export const RadioGroup = ({ value, onChange, ...props }) => {
  const children = React.Children.map(props.children, child => {
    const checked = value !== undefined && child.props.value === value;

    return React.cloneElement(child, { checked, onClick: onChange });
  });

  return <div {...props}>{children}</div>;
};

export default Radio;
