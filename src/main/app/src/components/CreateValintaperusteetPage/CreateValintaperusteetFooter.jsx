import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isValid } from 'redux-form';

import { JULKAISUTILA } from '../../constants';
import { submit as submitValintaperusteet } from '../../state/createValintaperusteetForm';
import Button from '../Button';

const valintaperusteetFormIsValid = isValid('createValintaperusteetForm');

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

const CreateValintaperusteetFooter = ({
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
    valid: valintaperusteetFormIsValid(state),
  }),
  dispatch => ({
    onSave: () => {
      dispatch(submitValintaperusteet({ tila: JULKAISUTILA.TALLENNETTU }));
    },
    onSaveAndPublish: () => {
      dispatch(submitValintaperusteet({ tila: JULKAISUTILA.JULKAISTU }));
    },
  }),
)(CreateValintaperusteetFooter);
