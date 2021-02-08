import React from 'react';

import styled from 'styled-components';

import { Icon } from '#/src/components/virkailija';

import AbstractCollapse from './AbstractCollapse';
import DividerHeading from './DividerHeading';

const SimpleCollapseHeader = styled.div`
  display: flex;
  color: inherit;
  opacity: 0.7;
  width: 100%;
  transition: opacity 0.25s;
  cursor: pointer;
  flex: 0 0 auto;
  &:hover {
    opacity: 1;
  }
  & h6 {
    margin-bottom: 5px;
  }
`;

const SimpleCollapseToggle = ({
  header,
  hiddenHeader,
  open,
  onToggle,
  ...props
}) => {
  return (
    <SimpleCollapseHeader onClick={onToggle} {...props}>
      <DividerHeading>
        <span>{open ? header : hiddenHeader ?? header}</span>
        <Icon
          style={{ float: 'right' }}
          type={open ? 'expand_more' : 'expand_less'}
        />
      </DividerHeading>
    </SimpleCollapseHeader>
  );
};

export const SimpleCollapse = ({
  children,
  header,
  hiddenHeader = undefined,
}) => {
  return (
    <>
      <AbstractCollapse content={children} defaultOpen={true}>
        {({ open, onToggle }) => (
          <SimpleCollapseToggle
            header={header}
            hiddenHeader={hiddenHeader}
            open={open}
            onToggle={onToggle}
          />
        )}
      </AbstractCollapse>
    </>
  );
};
