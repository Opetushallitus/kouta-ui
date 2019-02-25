import React, { useCallback } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isValid } from 'redux-form';

import { submit } from '../../state/editKoulutusForm';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';

const koulutusFormIsValid = isValid('editKoulutusForm');

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

const EditKoulutusFooter = ({ koulutus, valid, liitos = false, onSave = () => {} }) => {
  const { tila } = koulutus;

  const showPublishButton = tila !== JULKAISUTILA.JULKAISTU && !liitos;

  const onSaveAndPublish = useCallback(() => {
    onSave({ tila: JULKAISUTILA.JULKAISTU });
  }, [onSave]);

  return (
    <Wrapper>
      <Button variant="outlined" onClick={onSave}>
        Tallenna
      </Button>
      {showPublishButton ? (
        <PublishButton disabled={!valid} onClick={onSaveAndPublish}>
          Tallenna ja julkaise
        </PublishButton>
      ) : null}
    </Wrapper>
  );
};

export default connect(
  state => ({
    valid: koulutusFormIsValid(state),
  }),
  (
    dispatch,
    {
      koulutus: { oid: koulutusOid, organisaatioOid, tila, lastModified },
      liitos,
      myOrganisaatioOid,
    },
  ) => ({
    onSave: ({ tila: tilaArg } = {}) =>
      dispatch(
        submit({
          koulutusOid,
          tila: tilaArg || tila,
          organisaatioOid: organisaatioOid || myOrganisaatioOid,
          lastModified,
          liitos,
        }),
      ),
  }),
)(EditKoulutusFooter);
