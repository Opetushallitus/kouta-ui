import React from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import NavigationPrompt from 'react-router-navigation-prompt';
import styled, { css } from 'styled-components';

import Button from '#/src/components/Button';
import Container from '#/src/components/Container';
import UnsavedChangesDialog from '#/src/components/UnsavedChangesDialog';
import { useIsDirty, useIsSubmitting } from '#/src/hooks/form';
import { getThemeProp } from '#/src/theme';

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
  padding-top: ${({ theme }) => theme.spacing.unit * 6}px;
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
  align-items: center;
`;

const FooterActions = styled.div``;

const Wrapper = styled.div`
  border: 0;
  padding: 0;
  margin: 0;
  ${({ readOnly }) =>
    readOnly &&
    css`
      & .CollapseContent {
        .ButtonWrapper {
          opacity: 0.7;
          cursor: not-allowed;
          & * {
            pointer-events: none;
          }
        }
      }
    `}
`;

type FormPageProps = {
  header?: React.ReactNode;
  steps?: React.ReactNode;
  footer?: React.ReactNode;
  hasFooterHomeLink?: boolean;
  readOnly?: boolean;
  esikatseluControls?: React.ReactNode;
};

const FormPage: React.FC<FormPageProps> = ({
  header = null,
  steps = null,
  children = null,
  footer = null,
  hasFooterHomeLink = true,
  readOnly = false,
  esikatseluControls,
}) => {
  const { t } = useTranslation();
  const isSubmitting = useIsSubmitting();
  const isDirty = useIsDirty();

  return (
    <>
      <NavigationPrompt
        when={(currentLoc, nextLoc) => {
          const samePath =
            (nextLoc && nextLoc.pathname) ===
            (currentLoc && currentLoc.pathname);
          return !samePath && !isSubmitting && isDirty;
        }}
      >
        {props => <UnsavedChangesDialog {...props} />}
      </NavigationPrompt>
      <Wrapper readOnly={readOnly}>
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
                {esikatseluControls}
              </Buttons>
              <FooterActions>{footer}</FooterActions>
            </FooterWrapper>
          </Container>
        </FooterContainer>
      </Wrapper>
    </>
  );
};

export default FormPage;
