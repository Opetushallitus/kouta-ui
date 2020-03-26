import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

import { getThemeProp } from '../../theme';
import Button from '../Button';
import useTranslation from '../useTranslation';
import Container from '../Container';

const HeaderContainer = styled.div`
  background-color: white;
`;

const StepsContainer = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing.unit * 3}px 0px;
  background-color: ${getThemeProp('palette.primary.light')};
  justify-content: center;
  border-bottom: 2px solid ${getThemeProp('palette.primary.main')};
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

const FormContent = styled.div`
  background-color: ${getThemeProp('palette.mainBackground')};
  padding-top: ${({ theme }) => theme.spacing.unit * 6}px
  padding-bottom: ${({ theme, hasFooter }) =>
    theme.spacing.unit * 6 + (hasFooter ? 75 : 0)}px;
`;

const FooterWrapper = styled.div`
  ${({ hasFooterHomeLink }) =>
    hasFooterHomeLink &&
    css`
      display: flex;
      justify-content: space-between;
    `}
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FooterActions = styled.div``;

const Separator = styled.div`
  padding-left: 15px;
`;

const Draft = ({ url }) => {
  const Link = props => <a {...props}>{props.children}</a>;
  const { t } = useTranslation();

  return (
    <Separator>
      <Button
        as={Link}
        href={url}
        color="primary"
        variant="outlined"
        target="_blank"
      >
        {t('yleiset.esikatselu')}
      </Button>
    </Separator>
  );
};

const FormPage = ({
  header = null,
  steps = null,
  children = null,
  footer = null,
  draftUrl = null,
  hasFooterHomeLink = true,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <HeaderContainer>
        <Container>{header}</Container>
      </HeaderContainer>
      <StepsContainer>
        <Container>{steps}</Container>
      </StepsContainer>
      <FormContent hasFooter={!!footer}>
        <Container>{children}</Container>
      </FormContent>
      <FooterContainer>
        <Container>
          <FooterWrapper hasFooterHomeLink={hasFooterHomeLink}>
            <Buttons>
              {hasFooterHomeLink ? (
                <Button as={Link} to="/" color="primary" variant="outlined">
                  {t('yleiset.etusivulle')}
                </Button>
              ) : null}
              {draftUrl ? <Draft url={draftUrl} /> : null}
            </Buttons>
            <FooterActions>{footer}</FooterActions>
          </FooterWrapper>
        </Container>
      </FooterContainer>
    </>
  );
};

export default FormPage;
