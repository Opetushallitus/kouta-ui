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

const TabWrapper = styled.div`
  ${({ last }) =>
    !last &&
    css`
      margin-right: 6px;
    `}
`;

export const Tab = styled.div`
  padding: 6px 16px;
  position: relative;
  z-index: 1;
  white-space: nowrap;
  bottom: -1px;
  font-family: ${getThemeProp('typography.fontFamily')};
  line-height: ${getThemeProp('typography.lineHeight')};
  font-size: 1rem;
  color: ${getThemeProp('palette.primary.main')};
  border-bottom: 0px none;
  cursor: pointer;
  border: 1px solid transparent;
  border-top: 2px solid transparent;

  ${({ active }) => active && activeCss};
`;

const Tabs = ({ value, onChange = () => {}, ...props }) => {
  const childrenCount = React.Children.count(props.children);

  const children = React.Children.map(props.children, (child, index) => {
    const active = value !== undefined && child.props.value === value;
    const last = index === childrenCount - 1;

    const element = React.cloneElement(child, {
      active,
      onClick: () => {
        onChange(child.props.value);
      },
    });

    return <TabWrapper last={last}>{element}</TabWrapper>;
  });

  return <Wrapper {...props}>{children}</Wrapper>;
};

export default Tabs;
