import React, { useMemo, useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import ReduxForm from '../ReduxForm';
import KoulutusForm from '../KoulutusForm';
import FormConfigContext from '../FormConfigContext';
import getFormValuesByKoulutus from '../../utils/getFormValuesByKoulutus';
import useFieldValue from '../useFieldValue';
import getKoulutusFormConfig from '../../utils/getKoulutusFormConfig';

const KoulutusFormWrapper = props => {
  const koulutustyyppi = useFieldValue('koulutustyyppi');

  const config = useMemo(() => getKoulutusFormConfig(koulutustyyppi), [
    koulutustyyppi,
  ]);

  return (
    <FormConfigContext.Provider value={config}>
      <KoulutusForm {...props} />
    </FormConfigContext.Provider>
  );
};

const EditKoulutusForm = ({ onSave, koulutus, history, organisaatioOid, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByKoulutus(koulutus);
  }, [koulutus]);

  const onAttachToteutus = useCallback(() => {
    history.push(
      `/organisaatio/${organisaatioOid}/koulutus/${koulutus.oid}/toteutus`,
    );
  }, [history, koulutus]);

  return (
    <ReduxForm form="editKoulutusForm" initialValues={initialValues}>
      {() => (
        <KoulutusFormWrapper
          steps={false}
          isNewKoulutus={false}
          johtaaTutkintoon={Boolean(koulutus.johtaaTutkintoon)}
          onAttachToteutus={onAttachToteutus}
          koulutus={koulutus}
          organisaatioOid={organisaatioOid}
          {...props}
        />
      )}
    </ReduxForm>
  );
};

export default withRouter(EditKoulutusForm);
