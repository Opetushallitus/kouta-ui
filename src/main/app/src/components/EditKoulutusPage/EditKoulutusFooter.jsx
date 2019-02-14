import React, { useCallback } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { submit } from '../../state/editKoulutusForm';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';

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

const EditKoulutusFooter = ({ koulutus, onSave = () => {} }) => {
  const { tila } = koulutus;

  const onSaveAndPublish = useCallback(() => {
    onSave({ tila: JULKAISUTILA.JULKAISTU });
  }, [onSave]);

  return (
    <Wrapper>
      <Button variant="outlined" onClick={onSave}>
        Tallenna
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <PublishButton onClick={onSaveAndPublish}>
          Tallenna ja julkaise
        </PublishButton>
      ) : null}
    </Wrapper>
  );
};

export default connect(
  null,
  (dispatch, { koulutus: { oid: koulutusOid, organisaatioOid, tila, lastModified } }) => ({
    onSave: ({ tila: tilaArg } = {}) =>
      dispatch(submit({ koulutusOid, tila: tilaArg || tila, organisaatioOid, lastModified })),
  }),
)(EditKoulutusFooter);
