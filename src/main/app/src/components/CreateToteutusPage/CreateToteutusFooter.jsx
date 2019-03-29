import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isValid } from 'redux-form';

import { submit as submitToteutusForm } from '../../state/createToteutusForm';
import { JULKAISUTILA } from '../../constants';
import Button from '../Button';
import useTranslation from '../useTranslation';

const toteutusFormIsValid = isValid('createToteutusForm');

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

const CreateToteutusFooter = ({
  onSave = () => {},
  onSaveAndPublish = () => {},
  valid = true,
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <SaveButton onClick={onSave}>{t('yleiset.tallenna')}</SaveButton>
      <Button onClick={onSaveAndPublish} disabled={!valid}>
        {t('yleiset.tallennaJaJulkaise')}
      </Button>
    </Wrapper>
  );
}

export default connect(
  state => ({
    valid: toteutusFormIsValid(state),
  }),
  (dispatch, { koulutustyyppi }) => ({
    onSave: () => {
      dispatch(
        submitToteutusForm({ tila: JULKAISUTILA.TALLENNETTU, koulutustyyppi }),
      );
    },
    onSaveAndPublish: () => {
      dispatch(
        submitToteutusForm({ tila: JULKAISUTILA.JULKAISTU, koulutustyyppi }),
      );
    },
  }),
)(CreateToteutusFooter);
