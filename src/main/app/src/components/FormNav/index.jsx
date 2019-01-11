import React from 'react';
import styled, { css } from 'styled-components';

const FormNavGroupContainer = styled.div`
  display: flex;
`;

const GroupItemWrapper = styled.div`
  flex: 0;

  ${({ last }) =>
    !last &&
    css`
      margin-right: ${({ theme }) => theme.spacing.unit * 3}px;
    `}
`;

export const FormNavGroup = ({ children, ...props }) => {
  const childrenCount = React.Children.count(children);

  const formattedChildren = React.Children.map(children, (child, index) => {
    const last = index === childrenCount - 1;

    return <GroupItemWrapper last={last}>{child}</GroupItemWrapper>;
  });

  return (
    <FormNavGroupContainer {...props}>
      {formattedChildren}
    </FormNavGroupContainer>
  );
};

const FormNavWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const FormNav = ({ children = null, ...props }) => (
  <FormNavWrapper {...props}>{children}</FormNavWrapper>
);

export default FormNav;
