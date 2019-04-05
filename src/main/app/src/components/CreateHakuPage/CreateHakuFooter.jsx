import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isValid } from 'redux-form';

import { submit as submitHakuForm } from '../../state/createHakuForm';
import { JULKAISUTILA } from '../../constants';
import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';

const hakuFormIsValid = isValid('createHakuForm');

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

const CreateHakuFooter = ({
  onSave = () => {},
  onSaveAndPublish = () => {},
  valid = true,
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <SaveButton
        onClick={onSave}
        disabled={!valid}
        {...getTestIdProps('tallennaHakuButton')}
      >
        {t('yleiset.tallenna')}
      </SaveButton>
      <Button
        onClick={onSaveAndPublish}
        disabled={!valid}
        {...getTestIdProps('tallennaJaJulkaiseHakuButton')}
      >
        {t('yleiset.tallennaJaJulkaise')}
      </Button>
    </Wrapper>
  );
};

export default connect(
  state => ({
    valid: hakuFormIsValid(state),
  }),
  dispatch => ({
    onSave: () => {
      dispatch(submitHakuForm({ tila: JULKAISUTILA.TALLENNETTU }));
    },
    onSaveAndPublish: () => {
      dispatch(submitHakuForm({ tila: JULKAISUTILA.JULKAISTU }));
    },
  }),
)(CreateHakuFooter);
