import React, { useCallback } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isValid } from 'redux-form';

import { submit } from '../../state/editToteutusForm';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';

const toteutusFormIsValid = isValid('editToteutusForm');

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

const EditToteutusFooter = ({ toteutus, valid, onSave = () => {} }) => {
  const { tila } = toteutus;

  const onSaveAndPublish = useCallback(() => {
    onSave({ tila: JULKAISUTILA.JULKAISTU });
  }, [onSave]);

  return (
    <Wrapper>
      <Button variant="outlined" onClick={onSave}>
        Tallenna
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <PublishButton disabled={!valid} onClick={onSaveAndPublish}>
          Tallenna ja julkaise
        </PublishButton>
      ) : null}
    </Wrapper>
  );
};

export default connect(
  state => ({
    valid: toteutusFormIsValid(state),
  }),
  (dispatch, { toteutus: { oid: toteutusOid, organisaatioOid, tila, lastModified } }) => ({
    onSave: ({ tila: tilaArg } = {}) =>
      dispatch(submit({ toteutusOid, tila: tilaArg || tila, organisaatioOid, lastModified })),
  }),
)(EditToteutusFooter);
