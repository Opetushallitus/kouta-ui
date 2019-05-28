import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { JULKAISUTILA } from '../../constants';
import { submit as submitValintaperuste } from '../../state/createValintaperusteForm';
import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';

const SaveButton = styled(Button).attrs({ variant: 'outlined' })`
  margin-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const CreateValintaperusteFooter = ({
  onSave = () => {},
  onSaveAndPublish = () => {},
}) => {
  const { t } = useTranslation();

  return (
    <Flex justifyEnd>
      <SaveButton
        onClick={onSave}
        {...getTestIdProps('tallennaValintaperusteButton')}
      >
        {t('yleiset.tallenna')}
      </SaveButton>
      <Button
        onClick={onSaveAndPublish}
        {...getTestIdProps('tallennaJaJulkaiseValintaperusteButton')}
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
      dispatch(submitValintaperuste({ tila: JULKAISUTILA.TALLENNETTU }));
    },
    onSaveAndPublish: () => {
      dispatch(submitValintaperuste({ tila: JULKAISUTILA.JULKAISTU }));
    },
  }),
)(CreateValintaperusteFooter);
