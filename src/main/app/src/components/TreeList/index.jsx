import React from 'react';
import styled from 'styled-components';

import { spacing } from '../../theme';

const ChildrenContainer = styled.div`
  padding-left: ${spacing(2)};
`;

const ItemContainer = styled.div`
  padding-bottom: ${spacing(1)};
`;

const renderChildren = ({ children = [], level = 0, renderItem, defaultOpen }) => {
  return children.length > 0 ? (
    <ChildrenContainer>
      {children.map(childProps => {
        const { key, children = [], open = defaultOpen } = childProps;

        return (
          <div key={key}>
            <ItemContainer>
              {renderItem({ ...childProps, level: level + 1 })}
            </ItemContainer>

            {open ? renderChildren({ children, level: level + 1, renderItem }) : null}
          </div>
        );
      })}
    </ChildrenContainer>
  ) : null;
};

export const TreeList = ({ children: renderItem = () => null, items = [], collapse = false, defaultOpen = true }) => {
  return items.map(childProps => {
    const { key, children = [], open = defaultOpen } = childProps;

    return (
      <div key={key}>
        <ItemContainer>{renderItem({ ...childProps, level: 0 })}</ItemContainer>

        {open ? renderChildren({ children, level: 0, renderItem, defaultOpen }) : null}
      </div>
    );
  });
};

export default TreeList;
