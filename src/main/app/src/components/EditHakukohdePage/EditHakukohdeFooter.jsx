import React, { useCallback } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isValid } from 'redux-form';

import { submit } from '../../state/editHakukohdeForm';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';

const hakukohdeFormIsValid = isValid('editHakukohdeForm');

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

const EditHakukohdeFooter = ({ hakukohde, valid, onSave = () => {} }) => {
  const { tila } = hakukohde;

  const onSaveAndPublish = useCallback(() => {
    onSave({ tila: JULKAISUTILA.JULKAISTU });
  }, [onSave]);

  const { t } = useTranslation();

  return (
    <Wrapper>
      <Button
        variant="outlined"
        onClick={onSave}
        {...getTestIdProps('tallennaHakukohdeButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <PublishButton
          disabled={!valid}
          onClick={onSaveAndPublish}
          {...getTestIdProps('tallennaJaJulkaiseHakukohdeButton')}
        >
          {t('yleiset.tallennaJaJulkaise')}
        </PublishButton>
      ) : null}
    </Wrapper>
  );
};

export default connect(
  state => ({
    valid: hakukohdeFormIsValid(state),
  }),
  (dispatch, { hakukohde }) => ({
    onSave: ({ tila: tilaArg } = {}) =>
      dispatch(
        submit({
          hakukohde,
          tila: tilaArg,
        }),
      ),
  }),
)(EditHakukohdeFooter);
