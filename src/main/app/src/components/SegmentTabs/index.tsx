import React from 'react';

import styled from 'styled-components';

const SegmentTabsBase = styled.div`
  ${({ fullWidth }) =>
    fullWidth ? { display: 'flex', width: '100%' } : { display: 'inline-flex' }}
`;

const SegmentTabs = ({ value, children, ...props }) => {
  const validChildren = React.Children.toArray(children).filter(c =>
    React.isValidElement(c)
  );

  return (
    <SegmentTabsBase {...props}>
      {React.Children.map(validChildren, (c, index) => {
        return React.cloneElement(c, {
          active: value !== undefined && c.props.value === value,
          isFirst: index === 0,
          isLast: index === validChildren.length - 1,
          isInTabs: true,
        });
      })}
    </SegmentTabsBase>
  );
};

export default SegmentTabs;
