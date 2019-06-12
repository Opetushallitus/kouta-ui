import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { submit as submitKoulutusForm } from '../../state/createKoulutusForm';
import { JULKAISUTILA } from '../../constants';
import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';

const SaveButton = styled(Button).attrs({ variant: 'outlined' })`
  margin-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const KoulutusFooter = ({ onSave = () => {}, onSaveAndPublish = () => {} }) => {
  const { t } = useTranslation();

  return (
    <Flex justifyEnd>
      <SaveButton
        onClick={onSave}
        {...getTestIdProps('tallennaKoulutusButton')}
      >
        {t('yleiset.tallenna')}
      </SaveButton>

      <Button
        onClick={onSaveAndPublish}
        {...getTestIdProps('tallennaJaJulkaiseKoulutusButton')}
      >
        {t('yleiset.tallennaJaJulkaise')}
      </Button>
    </Flex>
  );
};

export default connect(
  null,
  dispatch => ({
    onSave: () => {
      return dispatch(submitKoulutusForm({ tila: JULKAISUTILA.TALLENNETTU }));
    },
    onSaveAndPublish: () => {
      return dispatch(submitKoulutusForm({ tila: JULKAISUTILA.JULKAISTU }));
    },
  }),
)(KoulutusFooter);
