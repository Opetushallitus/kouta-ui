import React, { useCallback } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { submit as submitSoraKuvausForm } from '../../state/editSoraKuvausForm';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
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

const PublishButton = styled(Button)`
  margin-left: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const EditSoraKuvausFooter = ({ soraKuvaus, onSave = () => {} }) => {
  const { tila } = soraKuvaus;

  const onSaveAndPublish = useCallback(() => {
    onSave({ tila: JULKAISUTILA.JULKAISTU });
  }, [onSave]);

  const { t } = useTranslation();

  return (
    <Wrapper>
      <Button
        variant="outlined"
        onClick={onSave}
        {...getTestIdProps('tallennaSoraKuvausButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <PublishButton
          onClick={onSaveAndPublish}
          {...getTestIdProps('tallennaJaJulkaiseSoraKuvausButton')}
        >
          {t('yleiset.tallennaJaJulkaise')}
        </PublishButton>
      ) : null}
    </Wrapper>
  );
};

export default connect(
  null,
  (dispatch, { soraKuvaus }) => ({
    onSave: ({ tila } = {}) => {
      return dispatch(submitSoraKuvausForm({ tila, soraKuvaus }));
    },
  }),
)(EditSoraKuvausFooter);
