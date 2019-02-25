import React from 'react';
import styled, { css } from 'styled-components';

import { getThemeProp, spacing } from '../../theme';
import Icon from '../Icon';
import { isFunction } from '../../utils';

export const TableBase = styled.table`
  width: 100%;
  border: 1px solid ${getThemeProp('palette.border')};
  border-spacing: 0px;
`;

const Wrapper = styled.div`
  overflow-x: auto;
`;

const SortIcon = styled(Icon)`
  margin-left: ${spacing(0.5)};
  color: ${getThemeProp('palette.text.primary')};
  cursor: pointer;
  font-size: 1.2rem;
`;

const SortContainer = styled.div`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

export const TableCellBase = styled.td`
  border-spacing: 0px;
  padding: ${spacing(1)} ${spacing(2)};
  border-bottom: 1px solid ${getThemeProp('palette.border')};
  text-align: left;
  ${getThemeProp('typography.body')};

  ${({ textCenter }) =>
    textCenter &&
    css`
      text-align: center;
    `}

  ${({ isTableHead }) =>
    isTableHead &&
    css`
      font-weight: bold;
      border-bottom: 2px solid ${getThemeProp('palette.primary.main')};
    `};
`;

const TableHeadBase = styled.thead`
  border-spacing: 0px;
`;

export const TableBody = styled.tbody``;

export const TableHead = ({ children, ...props }) => {
  const childrenProp = React.Children.map(children, child =>
    child
      ? React.cloneElement(child, {
          isTableHead: true,
        })
      : null,
  );

  return <TableHeadBase children={childrenProp} {...props} />;
};

const TableRowBase = styled.tr`
  border-spacing: 0px;

  ${({ isTableHead }) =>
    !isTableHead &&
    `
    &:last-child {
      ${TableCellBase} {
        border-bottom: 0px none;
      }
    }
  `}
`;

export const TableRow = ({ children, isTableHead = false, ...props }) => {
  const childrenProp = React.Children.map(children, child =>
    child
      ? React.cloneElement(child, {
          isTableHead,
          ...(isTableHead ? { as: 'th' } : {}),
        })
      : null,
  );

  return (
    <TableRowBase
      isTableHead={isTableHead}
      children={childrenProp}
      {...props}
    />
  );
};

export const TableCell = ({
  sortDirection,
  onSort,
  children = null,
  ...props
}) => {
  return (
    <TableCellBase {...props}>
      {isFunction(onSort) ? (
        <SortContainer
          onClick={() => {
            onSort(sortDirection === 'desc' ? 'asc' : 'desc');
          }}
        >
          {children}
          {sortDirection ? (
            <SortIcon
              type={
                sortDirection === 'desc' ? 'arrow_downward' : 'arrow_upward'
              }
            />
          ) : null}
        </SortContainer>
      ) : (
        children
      )}
    </TableCellBase>
  );
};

const Table = props => (
  <Wrapper>
    <TableBase {...props} />
  </Wrapper>
);

export default Table;
