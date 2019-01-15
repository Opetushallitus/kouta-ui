import React from 'react';
import styled from 'styled-components';

import { getThemeProp } from '../../theme';
import Header from './Header';
import Navigation from './Navigation';
import Content from './Content';
import FooterRoutes from './FooterRoutes';

const FormNavContainer = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing.unit * 3}px 0px;
  background-color: ${getThemeProp('palette.primary.light')};
  justify-content: center;
  border-bottom: 1px solid ${getThemeProp('palette.primary.dark')};
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
  padding: ${({ theme }) => theme.spacing.unit * 6}px 0px;
`;

const FormPage = () => (
  <>
    <ContentWrapper>
      <Header />
    </ContentWrapper>
    <FormNavContainer>
      <ContentWrapper>
        <Navigation />
      </ContentWrapper>
    </FormNavContainer>
    <FormContent>
      <ContentWrapper>
        <Content />
      </ContentWrapper>
    </FormContent>
    <FooterRoutes />
  </>
);

export default FormPage;
