import React from 'react';
import styled, { css } from 'styled-components';

import { getThemeProp } from '../../theme';

const Wrapper = styled.div`
  display: flex;
`;

const activeCss = css`
  border: 1px solid ${getThemeProp('palette.border')};
  border-top: 2px solid ${getThemeProp('palette.primary.main')};
  border-bottom: 1px solid white;
  color: ${getThemeProp('palette.text.primary')};
`;

export const Tab = styled.div`
  padding: 10px 20px;
  position: relative;
  z-index: 1;
  bottom: -1px;
  font-family: ${getThemeProp('typography.fontFamily')};
  font-size: 1rem;
  color: ${getThemeProp('palette.primary.main')};
  border-bottom: 0px none;
  margin-right: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  border-top: 2px solid transparent;

  ${({ active }) => active && activeCss};
`;

const Tabs = ({ value, onChange = () => {}, ...props }) => {
  const children = React.Children.map(props.children, child => {
    const active = value !== undefined && child.props.value === value;

    return React.cloneElement(child, {
      active,
      onClick: () => {
        onChange(child.props.value);
      },
    });
  });

  return <Wrapper {...props}>{children}</Wrapper>;
};

export default Tabs;
