import React, { useCallback } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isValid } from 'redux-form';

import { submit } from '../../state/editHakukohdeForm';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';

const hakukohdeFormIsValid = isValid('editHakukohdeForm');

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

const EditHakukohdeFooter = ({ hakukohde, valid, onSave = () => {} }) => {
  const { tila } = hakukohde;

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
    valid: hakukohdeFormIsValid(state),
  }),
  (
    dispatch,
    {
      hakukohde: {
        oid: hakukohdeOid,
        organisaatioOid,
        tila,
        lastModified,
        hakuOid,
        toteutusOid,
      },
    },
  ) => ({
    onSave: ({ tila: tilaArg } = {}) =>
      dispatch(
        submit({
          hakukohdeOid,
          tila: tilaArg || tila,
          organisaatioOid,
          lastModified,
          hakuOid,
          toteutusOid,
        }),
      ),
  }),
)(EditHakukohdeFooter);
