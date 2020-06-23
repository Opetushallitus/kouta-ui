import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Typography from '../Typography';
import { getThemeProp } from '../../theme';
import Icon from '../Icon';

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

const FormHeader = ({
  status = undefined,
  children = undefined,
  editInfo = undefined,
  hasHomeLink = true,
  ...props
}) => {
  const homeIconProps = hasHomeLink ? { as: Link, to: '/' } : {};

  return (
    <Container {...props}>
      {children && (
        <TitleContainer>
          <IconContainer {...homeIconProps}>
            <HomeIcon />
          </IconContainer>
          <Typography variant="h4">{children}</Typography>
        </TitleContainer>
      )}
      {status && <div>{status}</div>}
      {editInfo && <div>{editInfo}</div>}
    </Container>
  );
};

export default FormHeader;
