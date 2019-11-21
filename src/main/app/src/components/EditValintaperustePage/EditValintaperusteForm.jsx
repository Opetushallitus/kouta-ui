import React, { useMemo } from 'react';

import ValintaperusteForm from '../ValintaperusteForm';
import getFormValuesByValintaperuste from '../../utils/getFormValuesByValintaperuste';
import ReduxForm from '../ReduxForm';
import getValintaperusteFormConfig from '../../utils/getValintaperusteFormConfig';
import FormConfigContext from '../FormConfigContext';

const ValintaperusteFormWrapper = props => {
  const {
    koulutustyyppi,
    valintaperuste,
    steps,
    canSelectBase,
    canEditTyyppi
  } = props;

  const config = useMemo(() => getValintaperusteFormConfig(koulutustyyppi), [
    koulutustyyppi,
  ]);

  return (
    <FormConfigContext.Provider value={config}>
      <ValintaperusteForm {...props} />
    </FormConfigContext.Provider>
  );
};

const EditValintapersuteetForm = ({ valintaperuste, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByValintaperuste(valintaperuste);
  }, [valintaperuste]);

  return (
    <ReduxForm form="editValintaperusteForm" initialValues={initialValues}>
      {() => (<ValintaperusteFormWrapper {...props}
                                            valintaperuste={valintaperuste}
                                            steps={false}
                                            canSelectBase={false}
                                            canEditTyyppi={false} />

      )}
    </ReduxForm>
  );
};

export default EditValintapersuteetForm;
