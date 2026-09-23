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
    {
      // eslint-disable-next-line @eslint-react/no-children-map -- injects active/position state into each SegmentTab child; compound-component pattern, not a quick fix
      React.Children.map(children, (c, index) =>
        // eslint-disable-next-line @eslint-react/no-clone-element -- see no-children-map above
        React.cloneElement(c, {
          active: value !== undefined && c.props.value === value,
          isFirst: index === 0,
          // eslint-disable-next-line @eslint-react/no-children-count -- correctly handles all valid children shapes; see no-children-map above
          isLast: index === React.Children.count(children) - 1,
          isInTabs: true,
        })
      )
    }
  </SegmentTabsBase>
);
