import React from 'react';
import styled from 'styled-components';

import { spacing } from '../../theme';

const ChildrenContainer = styled.div`
  padding-left: ${spacing(2)};
`;

const ItemContainer = styled.div`
  padding-bottom: ${spacing(1)};
`;

const renderChildren = ({ children = [], level = 0, renderItem }) => {
  return children.length > 0 ? (
    <ChildrenContainer>
      {children.map(childProps => {
        const { key, children = [] } = childProps;

        return (
          <div key={key}>
            <ItemContainer>
              {renderItem({ ...childProps, level: level + 1 })}
            </ItemContainer>

            {renderChildren({ children, level: level + 1, renderItem })}
          </div>
        );
      })}
    </ChildrenContainer>
  ) : null;
};

export const TreeList = ({ children: renderItem = () => null, items = [], collapse = false }) => {
  return items.map(childProps => {
    const { key, children = [] } = childProps;

    return (
      <div key={key}>
        <ItemContainer>{renderItem({ ...childProps, level: 0 })}</ItemContainer>

        {renderChildren({ children, level: 0, renderItem })}
      </div>
    );
  });
};

export default TreeList;
