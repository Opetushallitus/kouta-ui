import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isValid } from 'redux-form';

import { submit as submitKoulutusForm } from '../../state/createKoulutusForm';
import { JULKAISUTILA } from '../../constants';
import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';

const koulutusFormIsValid = isValid('createKoulutusForm');

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

const KoulutusFooter = ({
  onSave = () => {},
  onSaveAndPublish = () => {},
  valid = true,
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <SaveButton
        onClick={onSave}
        {...getTestIdProps('tallennaKoulutusButton')}
      >
        {t('yleiset.tallenna')}
      </SaveButton>
      <Button
        onClick={onSaveAndPublish}
        {...getTestIdProps('tallennaJaJulkaiseKoulutusButton')}
        disabled={!valid}
      >
        {t('yleiset.tallennaJaJulkaise')}
      </Button>
    </Wrapper>
  );
};

export default connect(
  state => ({
    valid: koulutusFormIsValid(state),
  }),
  dispatch => ({
    onSave: () => {
      dispatch(submitKoulutusForm({ tila: JULKAISUTILA.TALLENNETTU }));
    },
    onSaveAndPublish: () => {
      dispatch(submitKoulutusForm({ tila: JULKAISUTILA.JULKAISTU }));
    },
  }),
)(KoulutusFooter);
