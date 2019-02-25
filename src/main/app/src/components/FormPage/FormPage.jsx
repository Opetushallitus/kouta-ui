import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

import { getThemeProp } from '../../theme';
import Button from '../Button';

const StepsContainer = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing.unit * 3}px 0px;
  background-color: ${getThemeProp('palette.primary.light')};
  justify-content: center;
  border-bottom: 1px solid ${getThemeProp('palette.primary.dark')};
`;

const FooterContainer = styled.div`
  background-color: white;
  border-top: 2px solid ${getThemeProp('palette.primary.main')};
  padding: ${({ theme }) => theme.spacing.unit * 2}px 0px;
  bottom: 0px;
  position: fixed;
  left: 0px;
  width: 100%;
  z-index: 99;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0px auto;
  padding: 0px ${({ theme }) => theme.spacing.unit * 3}px;
  box-sizing: border-box;
`;

const FormContent = styled.div`
  background-color: #f5f5f5;
  padding-top: ${({ theme }) => theme.spacing.unit * 6}px
  padding-bottom: ${({ theme, hasFooter }) =>
    theme.spacing.unit * 6 + (hasFooter ? 50 : 0)}px;
`;

const FooterWrapper = styled.div`
  ${({ hasFooterHomeLink }) =>
    hasFooterHomeLink &&
    css`
      display: flex;
      justify-content: space-between;
    `}
`;

const FooterActions = styled.div``;

const FormPage = ({
  header = null,
  steps = null,
  children = null,
  footer = null,
  hasFooterHomeLink = true,
}) => (
  <>
    <ContentWrapper>{header}</ContentWrapper>
    <StepsContainer>
      <ContentWrapper>{steps}</ContentWrapper>
    </StepsContainer>
    <FormContent hasFooter={!!footer}>
      <ContentWrapper>{children}</ContentWrapper>
    </FormContent>
    {footer ? (
      <FooterContainer>
        <ContentWrapper>
          <FooterWrapper hasFooterHomeLink={hasFooterHomeLink}>
            {hasFooterHomeLink ? (
              <Button as={Link} to="/" color="primary" variant="outlined">
                Etusivulle
              </Button>
            ) : null}
            <FooterActions>{footer}</FooterActions>
          </FooterWrapper>
        </ContentWrapper>
      </FooterContainer>
    ) : null}
  </>
);

export default FormPage;
