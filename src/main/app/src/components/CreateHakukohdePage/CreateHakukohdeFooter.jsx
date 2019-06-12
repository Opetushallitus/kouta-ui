import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { submit as submitHakukohdeForm } from '../../state/createHakukohdeForm';
import { JULKAISUTILA } from '../../constants';
import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';

const SaveButton = styled(Button).attrs({ variant: 'outlined' })`
  margin-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const CreateHakukohdeFooter = ({
  onSave = () => {},
  onSaveAndPublish = () => {},
}) => {
  const { t } = useTranslation();

  return (
    <Flex justifyEnd>
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
    </Flex>
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
