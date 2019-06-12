import React, { useCallback } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { submit } from '../../state/editToteutusForm';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';

const PublishButton = styled(Button)`
  margin-left: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const EditToteutusFooter = ({ toteutus, onSave = () => {} }) => {
  const { tila } = toteutus;

  const onSaveAndPublish = useCallback(() => {
    onSave({ tila: JULKAISUTILA.JULKAISTU });
  }, [onSave]);

  const { t } = useTranslation();

  return (
    <Flex justifyEnd>
      <Button
        variant="outlined"
        onClick={onSave}
        {...getTestIdProps('tallennaToteutusButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <PublishButton
          onClick={onSaveAndPublish}
          {...getTestIdProps('tallennaJaJulkaiseToteutusButton')}
        >
          {t('yleiset.tallennaJaJulkaise')}
        </PublishButton>
      ) : null}
    </Flex>
  );
};

export default connect(
  null,
  (dispatch, { toteutus }) => ({
    onSave: ({ tila: tilaArg } = {}) =>
      dispatch(submit({ toteutus, tila: tilaArg })),
  }),
)(EditToteutusFooter);
