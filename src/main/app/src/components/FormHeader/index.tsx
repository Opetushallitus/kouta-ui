import React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Icon, Typography } from '#/src/components/virkailija';
import { getThemeProp } from '#/src/theme';

const HomeIcon = styled(Icon).attrs({ type: 'home' })`
  color: ${getThemeProp('palette.text.dark')};
  font-size: 1.5rem;
`;

const IconContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  margin-right: ${({ theme }) => theme.spacing.unit * 2}px;
  border: 1px solid ${getThemeProp('palette.text.primary')};
  border-radius: ${getThemeProp('shape.borderRadius')};
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.unit * 2}px 0px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

type FormHeaderProps = {
  status?: React.ReactNode;
  children: React.ReactNode;
  editInfo?: React.ReactNode;
  hasHomeLink?: boolean;
};

const FormHeader = ({
  status,
  children,
  editInfo,
  hasHomeLink = true,
  ...props
}: FormHeaderProps) => {
  const homeIconProps = hasHomeLink ? { as: Link, to: '/' } : {};

  return (
    <Container {...props}>
      {children && (
        <TitleContainer>
          <IconContainer {...homeIconProps}>
            <HomeIcon />
          </IconContainer>
          <Typography variant="h5">{children}</Typography>
        </TitleContainer>
      )}
      {status && <div>{status}</div>}
      {editInfo && <div>{editInfo}</div>}
    </Container>
  );
};

export default FormHeader;
