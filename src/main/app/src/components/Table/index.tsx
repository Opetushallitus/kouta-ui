import React from 'react';

import _ from 'lodash';
import styled, { css } from 'styled-components';

import { Icon } from '#/src/components/virkailija';
import { getThemeProp, spacing } from '#/src/theme';

export const TableBase = styled.table`
  width: 100%;
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
      white-space: nowrap;
      color: ${getThemeProp('palette.text.dark')};
      font-weight: 500;
      border-bottom: 1px solid ${getThemeProp('palette.border')};
    `};

  ${({ active }) =>
    active &&
    css`
      background-color: ${getThemeProp('palette.primary.light')};
    `}

  ${({ noBorder }) =>
    noBorder &&
    css`
      border-color: transparent;
    `}
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
      : null
  );

  return <TableHeadBase children={childrenProp} {...props} />;
};

const TableRowBase = styled.tr`
  border-spacing: 0px;

  ${({ isTableHead }) =>
    !isTableHead &&
    css`
      &:nth-child(even) {
        background-color: ${getThemeProp('palette.mainBackground')};
      }

      &:hover {
        background-color: ${({ theme }) => theme.palette.primary.light};
      }
    `}

  ${({ noBorder }) =>
    noBorder &&
    css`
      ${TableCellBase} {
        border-bottom: 0px none;
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
      : null
  );

  return (
    <TableRowBase
      isTableHead={isTableHead}
      children={childrenProp}
      {...props}
    />
  );
};

type TableCellProps = {
  sortDirection?: 'asc' | 'desc';
  onSort?: ((any) => void) | null;
  children?: React.ReactNode;
  textCenter?: boolean;
  isTableHead?: boolean;
  noBorder?: boolean;
  active?: boolean;
} & React.HTMLProps<HTMLTableCellElement>;

export const TableCell = ({
  sortDirection,
  onSort,
  children,
  ...props
}: TableCellProps) => {
  return (
    <TableCellBase {...props}>
      {_.isFunction(onSort) ? (
        <SortContainer
          onClick={() => {
            onSort(sortDirection === 'desc' ? 'asc' : 'desc');
          }}
        >
          {children}
          {sortDirection ? (
            <SortIcon
              type={
                sortDirection === 'desc' ? 'arrow_drop_down' : 'arrow_drop_up'
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
