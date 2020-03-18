import React, { useMemo, useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import ToteutusForm from '../ToteutusForm';
import getFormValuesByToteutus from '../../utils/getFormValuesByToteutus';
import ReduxForm from '../ReduxForm';
import FormConfigContext from '../FormConfigContext';
import getToteutusFormConfig from '../../utils/getToteutusFormConfig';

const ToteutusFormWrapper = props => {
  const { koulutustyyppi } = props;

  const config = useMemo(() => getToteutusFormConfig(koulutustyyppi), [
    koulutustyyppi,
  ]);

  return (
    <FormConfigContext.Provider value={config}>
      <ToteutusForm {...props} />
    </FormConfigContext.Provider>
  );
};

const EditToteutusForm = ({ toteutus, history, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByToteutus(toteutus);
  }, [toteutus]);

  const onAttachHakukohde = useCallback(
    ({ hakuOid }) => {
      if (hakuOid) {
        history.push(
          `/organisaatio/${toteutus.organisaatioOid}/toteutus/${toteutus.oid}/haku/${hakuOid}/hakukohde`,
        );
      }
    },
    [history, toteutus],
  );

  return (
    <ReduxForm form="editToteutusForm" initialValues={initialValues}>
      {() => (
        <ToteutusFormWrapper
          {...props}
          toteutus={toteutus}
          steps={false}
          canSelectBase={false}
          onAttachHakukohde={onAttachHakukohde}
        />
      )}
    </ReduxForm>
  );
};

export default withRouter(EditToteutusForm);
