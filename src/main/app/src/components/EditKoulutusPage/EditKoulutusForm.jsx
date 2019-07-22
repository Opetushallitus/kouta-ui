import React, { useMemo, useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import ReduxForm from '../ReduxForm';
import KoulutusForm from '../KoulutusForm';
import getFormValuesByKoulutus from '../../utils/getFormValuesByKoulutus';

const EditKoulutusForm = ({ onSave, koulutus, history, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByKoulutus(koulutus);
  }, [koulutus]);

  const onAttachToteutus = useCallback(() => {
    history.push(
      `/organisaatio/${koulutus.organisaatioOid}/koulutus/${
        koulutus.oid
      }/toteutus`,
    );
  }, [history, koulutus]);

  return (
    <ReduxForm form="editKoulutusForm" initialValues={initialValues}>
      {() => (
        <KoulutusForm
          steps={false}
          canSelectBase={false}
          canEditKoulutustyyppi={false}
          johtaaTutkintoon={Boolean(koulutus.johtaaTutkintoon)}
          onAttachToteutus={onAttachToteutus}
          {...props}
        />
      )}
    </ReduxForm>
  );
};

export default withRouter(EditKoulutusForm);
