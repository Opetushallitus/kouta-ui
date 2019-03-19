import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isValid } from 'redux-form';

import { JULKAISUTILA } from '../../constants';
import { submit as submitValintaperuste } from '../../state/createValintaperusteForm';
import Button from '../Button';

const valintaperusteFormIsValid = isValid('createValintaperusteForm');

const Wrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  box-sizing: border-box;
  margin: 0px auto;
  display: flex;
  justify-content: flex-end;
`;

const SaveButton = styled(Button).attrs({ variant: 'outlined' })`
  margin-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const CreateValintaperusteFooter = ({
  onSave = () => {},
  onSaveAndPublish = () => {},
  valid = true,
}) => (
  <Wrapper>
    <SaveButton onClick={onSave} disabled={!valid}>
      Tallenna
    </SaveButton>
    <Button onClick={onSaveAndPublish} disabled={!valid}>
      Tallenna ja julkaise
    </Button>
  </Wrapper>
);

export default connect(
  state => ({
    valid: valintaperusteFormIsValid(state),
  }),
  dispatch => ({
    onSave: () => {
      dispatch(submitValintaperuste({ tila: JULKAISUTILA.TALLENNETTU }));
    },
    onSaveAndPublish: () => {
      dispatch(submitValintaperuste({ tila: JULKAISUTILA.JULKAISTU }));
    },
  }),
)(CreateValintaperusteFooter);
