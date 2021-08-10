import React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Box, Icon, Typography } from '#/src/components/virkailija';
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
  justify-content: flex-start;
`;

type FormHeaderProps = {
  title: string;
  status?: React.ReactNode;
  children?: React.ReactNode;
  hasHomeLink?: boolean;
};

const FormHeader = ({
  title,
  status,
  children,
  hasHomeLink = true,
}: FormHeaderProps) => {
  const homeIconProps = hasHomeLink ? { as: Link, to: '/' } : {};

  return (
    <Container>
      <TitleContainer>
        <IconContainer {...homeIconProps}>
          <HomeIcon />
        </IconContainer>
        <Typography variant="h5">{title}</Typography>
        {status && (
          <Box ml={2} mr={2}>
            {status}
          </Box>
        )}
      </TitleContainer>
      {children}
    </Container>
  );
};

export default FormHeader;
