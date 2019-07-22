import React, { useMemo, useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import HakuForm from '../HakuForm';
import getFormValuesByHaku from '../../utils/getFormValuesByHaku';
import ReduxForm from '../ReduxForm';

const EditHakuForm = ({ onSave, haku, history, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByHaku(haku);
  }, [haku]);

  const onAttachHakukohde = useCallback(
    ({ toteutusOid }) => {
      if (toteutusOid) {
        history.push(
          `/organisaatio/${haku.organisaatioOid}/toteutus/${toteutusOid}/haku/${
            haku.oid
          }/hakukohde`,
        );
      }
    },
    [history, haku],
  );

  return (
    <ReduxForm form="editHakuForm" initialValues={initialValues}>
      {() => (
        <HakuForm
          steps={false}
          initialValues={initialValues}
          haku={haku}
          onAttachHakukohde={onAttachHakukohde}
          canSelectBase={false}
          {...props}
        />
      )}
    </ReduxForm>
  );
};

export default withRouter(EditHakuForm);
