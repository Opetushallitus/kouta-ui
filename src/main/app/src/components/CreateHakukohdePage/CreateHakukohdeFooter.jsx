import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { submit as submitHakukohdeForm } from '../../state/createHakukohdeForm';
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

const CreateHakukohdeFooter = ({
  onSave = () => {},
  onSaveAndPublish = () => {},
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <SaveButton
        onClick={onSave}
        {...getTestIdProps('tallennaHakukohdeButton')}
      >
        {t('yleiset.tallenna')}
      </SaveButton>
      <Button
        onClick={onSaveAndPublish}
        {...getTestIdProps('tallennaJaJulkaiseHakukohdeButton')}
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
      dispatch(submitHakukohdeForm({ tila: JULKAISUTILA.TALLENNETTU }));
    },
    onSaveAndPublish: () => {
      dispatch(submitHakukohdeForm({ tila: JULKAISUTILA.JULKAISTU }));
    },
  }),
)(CreateHakukohdeFooter);
