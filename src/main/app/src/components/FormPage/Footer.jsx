import React from 'react';
import styled from 'styled-components';

import { getThemeProp } from '../../theme';
import Button from '../Button';

const Container = styled.div`
  background-color: white;
  border-top: 2px solid ${getThemeProp('palette.primary.main')};
  padding: ${({ theme }) => theme.spacing.unit * 3}px 0px;
`;

const Wrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  box-sizing: border-box;
  margin: 0px auto;
  display: flex;
  justify-content: flex-end;
  padding: 0px ${({ theme }) => theme.spacing.unit * 3}px;
`;

const SaveButton = styled(Button).attrs({ variant: 'outlined' })`
  margin-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const Footer = ({
  onSave = () => {},
  onSaveAndPublish = () => {},
  valid = true,
}) => (
  <Container>
    <Wrapper>
      <SaveButton onClick={onSave} disabled={!valid}>
        Tallenna
      </SaveButton>
      <Button onClick={onSaveAndPublish} disabled={!valid}>
        Tallenna ja julkaise
      </Button>
    </Wrapper>
  </Container>
);

export default Footer;
