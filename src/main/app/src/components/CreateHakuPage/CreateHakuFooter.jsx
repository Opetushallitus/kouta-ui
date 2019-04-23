import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { submit as submitHakuForm } from '../../state/createHakuForm';
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

const CreateHakuFooter = ({
  onSave = () => {},
  onSaveAndPublish = () => {},
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <SaveButton onClick={onSave} {...getTestIdProps('tallennaHakuButton')}>
        {t('yleiset.tallenna')}
      </SaveButton>
      <Button
        onClick={onSaveAndPublish}
        {...getTestIdProps('tallennaJaJulkaiseHakuButton')}
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
      dispatch(submitHakuForm({ tila: JULKAISUTILA.TALLENNETTU }));
    },
    onSaveAndPublish: () => {
      dispatch(submitHakuForm({ tila: JULKAISUTILA.JULKAISTU }));
    },
  }),
)(CreateHakuFooter);
