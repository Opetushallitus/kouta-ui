import React, { useCallback } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { submit } from '../../state/editHakuForm';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
import { getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import Flex from '../Flex';

const PublishButton = styled(Button)`
  margin-left: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const EditHakuFooter = ({ haku, onSave = () => {} }) => {
  const { tila } = haku;

  const onSaveAndPublish = useCallback(() => {
    onSave({ tila: JULKAISUTILA.JULKAISTU });
  }, [onSave]);

  const { t } = useTranslation();

  return (
    <Flex justifyEnd>
      <Button
        variant="outlined"
        onClick={onSave}
        {...getTestIdProps('tallennaHakuButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <PublishButton
          onClick={onSaveAndPublish}
          {...getTestIdProps('tallennaJaJulkaiseHakuButton')}
        >
          {t('yleiset.tallennaJaJulkaise')}
        </PublishButton>
      ) : null}
    </Flex>
  );
};

export default connect(
  null,
  (
    dispatch,
    { haku: { oid: hakuOid, organisaatioOid, tila, lastModified } },
  ) => ({
    onSave: ({ tila: tilaArg } = {}) =>
      dispatch(
        submit({
          hakuOid,
          tila: tilaArg || tila,
          organisaatioOid,
          lastModified,
        }),
      ),
  }),
)(EditHakuFooter);
