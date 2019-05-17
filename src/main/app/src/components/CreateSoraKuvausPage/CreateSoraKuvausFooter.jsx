import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { submit as submitSoraKuvausForm } from '../../state/createSoraKuvausForm';
import { JULKAISUTILA } from '../../constants';
import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';

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

const CreateSoraKuvausFooter = ({
  onSave = () => {},
  onSaveAndPublish = () => {},
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <SaveButton
        onClick={onSave}
        {...getTestIdProps('tallennaSoraKuvausButton')}
      >
        {t('yleiset.tallenna')}
      </SaveButton>
      <Button
        onClick={onSaveAndPublish}
        {...getTestIdProps('tallennaJaJulkaiseSoraKuvausButton')}
      >
        {t('yleiset.tallennaJaJulkaise')}
      </Button>
    </Wrapper>
  );
};

export default connect(
  null,
  dispatch => ({
    onSave: () => {
      return dispatch(submitSoraKuvausForm({ tila: JULKAISUTILA.TALLENNETTU }));
    },
    onSaveAndPublish: () => {
      return dispatch(submitSoraKuvausForm({ tila: JULKAISUTILA.JULKAISTU }));
    },
  }),
)(CreateSoraKuvausFooter);
