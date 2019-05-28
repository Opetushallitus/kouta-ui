import React, { useCallback } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { submit } from '../../state/editHakukohdeForm';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';

const PublishButton = styled(Button)`
  margin-left: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const EditHakukohdeFooter = ({ hakukohde, onSave = () => {} }) => {
  const { tila } = hakukohde;

  const onSaveAndPublish = useCallback(() => {
    onSave({ tila: JULKAISUTILA.JULKAISTU });
  }, [onSave]);

  const { t } = useTranslation();

  return (
    <Flex justifyEnd>
      <Button
        variant="outlined"
        onClick={onSave}
        {...getTestIdProps('tallennaHakukohdeButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <PublishButton
          onClick={onSaveAndPublish}
          {...getTestIdProps('tallennaJaJulkaiseHakukohdeButton')}
        >
          {t('yleiset.tallennaJaJulkaise')}
        </PublishButton>
      ) : null}
    </Flex>
  );
};

export default connect(
  null,
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
