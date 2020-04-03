import React, { useMemo, useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import HakuForm from '../HakuForm';
import getFormValuesByHaku from '../../utils/getFormValuesByHaku';
import getHakuFormConfig from '../../utils/getHakuFormConfig';
import FormConfigContext from '../FormConfigContext';
import useInitialValues from '#/src/components/useInitialValues';

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
    [history, organisaatioOid, haku],
  );

  useInitialValues(initialValues);

  return (
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
  );
};

export default withRouter(EditHakuForm);
