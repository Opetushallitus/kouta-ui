import React from 'react';

import NavigationPrompt from 'react-router-navigation-prompt';
import styled, { css } from 'styled-components';

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
  position: sticky;
  left: 0px;
  width: 100%;
  z-index: 99;
  height: 36px;
  bottom: 0;
`;

const FormContent = styled.div`
  background-color: ${getThemeProp('palette.mainBackground')};
  padding-top: ${({ theme }) => theme.spacing.unit * 6}px;
  padding-bottom: ${({ theme }) => theme.spacing.unit * 6}px;
  flex-grow: 1;
  flex-basis: 100%;
`;

const FooterActions = styled.div``;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 0;
  padding: 0;
  margin: 0;
  height: 100%;
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
  readOnly = false,
}) => {
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
            <FooterActions>{footer}</FooterActions>
          </Container>
        </FooterContainer>
      </Wrapper>
    </>
  );
};

export default FormPage;
