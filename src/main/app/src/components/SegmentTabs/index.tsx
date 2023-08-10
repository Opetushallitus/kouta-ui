import React from 'react';

import styled from 'styled-components';

import { SegmentTab } from '../SegmentTab';

const SegmentTabsBase = styled.div<{ fullWidth?: boolean }>`
  ${({ fullWidth }) =>
    fullWidth ? { display: 'flex', width: '100%' } : { display: 'inline-flex' }}
`;

export const SegmentTabs = ({
  value,
  children,
  ...props
}: {
  value: string;
  children:
    | Array<React.ReactElement<React.ComponentProps<typeof SegmentTab>>>
    | React.ReactElement<React.ComponentProps<typeof SegmentTab>>;
}) => (
  <SegmentTabsBase {...props}>
    {React.Children.map(children, (c, index) =>
      React.cloneElement(c, {
        active: value !== undefined && c.props.value === value,
        isFirst: index === 0,
        isLast: index === React.Children.count(children) - 1,
        isInTabs: true,
      })
    )}
  </SegmentTabsBase>
);
