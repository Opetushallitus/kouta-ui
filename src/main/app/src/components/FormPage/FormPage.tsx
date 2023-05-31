import React from 'react';

import { QueryObserverResult } from 'react-query';
import NavigationPrompt from 'react-router-navigation-prompt';
import styled, { css } from 'styled-components';

import Container from '#/src/components/Container';
import FullSpin from '#/src/components/FullSpin';
import { OverlaySpin } from '#/src/components/OverlaySpin';
import { QueryResultWrapper } from '#/src/components/QueryResultWrapper';
import { ReduxForm } from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import UnsavedChangesDialog from '#/src/components/UnsavedChangesDialog';
import { ENTITY, FormMode } from '#/src/constants';
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
      & .disableForReadOnly {
        .CollapseContent {
          .ButtonWrapper {
            opacity: 0.7;
            cursor: not-allowed;
            & * {
              pointer-events: none;
            }
          }
        }
      }
    `}
`;

type FormPageProps = {
  title: string;
  entityType: ENTITY;
  formMode: FormMode;
  initialValues: Record<string, any>;
  queryResult?: QueryObserverResult | Array<QueryObserverResult>;
  header?: React.ReactNode;
  steps?: React.ReactNode;
  footer?: React.ReactNode;
  readOnly?: boolean;
};

const ConditionalQueryResult = ({ queryResult, children }) =>
  queryResult ? (
    <QueryResultWrapper queryResult={queryResult} LoadingWrapper={FullSpin}>
      {children}
    </QueryResultWrapper>
  ) : (
    children
  );

const FormPageContent = ({
  title,
  header = null,
  steps = null,
  children = null,
  footer = null,
  readOnly = false,
}: any) => {
  const isSubmitting = useIsSubmitting();
  const isDirty = useIsDirty();
  return (
    <>
      {isSubmitting && <OverlaySpin />}
      <Title>{title}</Title>
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
        <FormContent>
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

const FormPage: React.FC<FormPageProps> = props => {
  const {
    entityType,
    formMode,
    initialValues,
    queryResult,
    readOnly = false,
  } = props;
  const isSubmitting = useIsSubmitting();
  return (
    <ConditionalQueryResult queryResult={queryResult}>
      <ReduxForm
        form={entityType}
        mode={formMode}
        initialValues={initialValues}
        disabled={isSubmitting || readOnly}
      >
        <FormPageContent {...props} />
      </ReduxForm>
    </ConditionalQueryResult>
  );
};

export default FormPage;
