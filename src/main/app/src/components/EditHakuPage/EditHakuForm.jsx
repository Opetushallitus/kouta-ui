import React, { useMemo, useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import HakuForm from '../HakuForm';
import getFormValuesByHaku from '../../utils/getFormValuesByHaku';
import ReduxForm from '../ReduxForm';
import getHakuFormConfig from '../../utils/getHakuFormConfig';
import FormConfigContext from '../FormConfigContext';

const config = getHakuFormConfig();

const EditHakuForm = ({ onSave, haku, history, organisaatioOid, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByHaku(haku);
  }, [haku]);

  const onAttachHakukohde = useCallback(
    ({ toteutusOid }) => {
      if (toteutusOid) {
        history.push(
          `/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/haku/${haku.oid}/hakukohde`,
        );
      }
    },
    [history, haku],
  );

  return (
    <ReduxForm form="editHakuForm" initialValues={initialValues}>
      {() => (
        <FormConfigContext.Provider value={config}>
          <HakuForm
            steps={false}
            initialValues={initialValues}
            haku={haku}
            onAttachHakukohde={onAttachHakukohde}
            canSelectBase={false}
            organisaatioOid={organisaatioOid}
            {...props}
          />
        </FormConfigContext.Provider>
      )}
    </ReduxForm>
  );
};

export default withRouter(EditHakuForm);
