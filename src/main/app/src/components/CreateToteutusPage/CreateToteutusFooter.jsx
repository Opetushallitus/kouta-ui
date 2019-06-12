import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { submit as submitToteutusForm } from '../../state/createToteutusForm';
import { JULKAISUTILA } from '../../constants';
import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';

const SaveButton = styled(Button).attrs({ variant: 'outlined' })`
  margin-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const CreateToteutusFooter = ({
  onSave = () => {},
  onSaveAndPublish = () => {},
}) => {
  const { t } = useTranslation();

  return (
    <Flex justifyEnd>
      <SaveButton
        onClick={onSave}
        {...getTestIdProps('tallennaToteutusButton')}
      >
        {t('yleiset.tallenna')}
      </SaveButton>
      <Button
        onClick={onSaveAndPublish}
        {...getTestIdProps('tallennaJaJulkaiseToteutusButton')}
      >
        {t('yleiset.tallennaJaJulkaise')}
      </Button>
    </Flex>
  );
};

export default connect(
  null,
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
