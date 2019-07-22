import React, { useMemo, useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import ToteutusForm from '../ToteutusForm';
import getFormValuesByToteutus from '../../utils/getFormValuesByToteutus';
import ReduxForm from '../ReduxForm';

const EditToteutusForm = ({ toteutus, history, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByToteutus(toteutus);
  }, [toteutus]);

  const onAttachHakukohde = useCallback(
    ({ hakuOid }) => {
      if (hakuOid) {
        history.push(
          `/organisaatio/${toteutus.organisaatioOid}/toteutus/${
            toteutus.oid
          }/haku/${hakuOid}/hakukohde`,
        );
      }
    },
    [history, toteutus],
  );

  return (
    <ReduxForm form="editToteutusForm" initialValues={initialValues}>
      {() => (
        <ToteutusForm
          {...props}
          toteutus={toteutus}
          steps={false}
          canCopy={false}
          onAttachHakukohde={onAttachHakukohde}
        />
      )}
    </ReduxForm>
  );
};

export default withRouter(EditToteutusForm);
