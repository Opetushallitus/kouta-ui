import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isValid } from 'redux-form';

import { submit as submitHakukohdeForm } from '../../state/createHakukohdeForm';
import { JULKAISUTILA } from '../../constants';
import Button from '../Button';

const hakukohdeFormIsValid = isValid('createHakukohdeForm');

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

const CreateHakukohdeFooter = ({
  onSave = () => {},
  onSaveAndPublish = () => {},
  valid = true,
}) => (
  <Wrapper>
    <SaveButton onClick={onSave}>
      Tallenna
    </SaveButton>
    <Button onClick={onSaveAndPublish} disabled={!valid}>
      Tallenna ja julkaise
    </Button>
  </Wrapper>
);

export default connect(
  state => ({
    valid: hakukohdeFormIsValid(state),
  }),
  dispatch => ({
    onSave: () => {
      dispatch(submitHakukohdeForm({ tila: JULKAISUTILA.TALLENNETTU }));
    },
    onSaveAndPublish: () => {
      dispatch(submitHakukohdeForm({ tila: JULKAISUTILA.JULKAISTU }))
    },
  }),
)(CreateHakukohdeFooter);
