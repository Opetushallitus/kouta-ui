import React, { useCallback } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isValid } from 'redux-form';

import { submit } from '../../state/editHakuForm';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';

const hakuFormIsValid = isValid('editHakuForm');

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

const EditHakuFooter = ({ haku, valid, onSave = () => {} }) => {
  const { tila } = haku;

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
    valid: hakuFormIsValid(state),
  }),
  (dispatch, { haku: { oid: hakuOid, organisaatioOid, tila, lastModified } }) => ({
    onSave: ({ tila: tilaArg } = {}) =>
      dispatch(submit({ hakuOid, tila: tilaArg || tila, organisaatioOid, lastModified })),
  }),
)(EditHakuFooter);
