import React from 'react';
import styled from 'styled-components';

const GridRowBase = styled.div`
  display: flex;
  margin: -${({ theme, gutter }) => (theme.spacing.unit * gutter) / 2}px;
  flex-wrap: wrap;
`;

const GridRow = ({ gutter = 2, children }) => {
  const wrappedChildren = React.Children.map(children, child =>
    React.cloneElement(child, { gutter })
  );

  return <GridRowBase gutter={gutter}>{wrappedChildren}</GridRowBase>;
};

export default GridRow;
