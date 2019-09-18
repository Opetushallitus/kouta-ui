import React, { useMemo } from 'react';

import ValintaperusteForm from '../ValintaperusteForm';
import getFormValuesByValintaperuste from '../../utils/getFormValuesByValintaperuste';
import ReduxForm from '../ReduxForm';
import getValintaperusteFormConfig from '../../utils/getValintaperusteFormConfig';
import FormConfigContext from '../FormConfigContext';

const config = getValintaperusteFormConfig();

const EditValintapersuteetForm = ({ valintaperuste, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByValintaperuste(valintaperuste);
  }, [valintaperuste]);

  return (
    <ReduxForm form="editValintaperusteForm" initialValues={initialValues}>
      {() => (
        <FormConfigContext.Provider value={config}>
          <ValintaperusteForm
            {...props}
            valintaperuste={valintaperuste}
            steps={false}
            canSelectBase={false}
            canEditTyyppi={false}
          />
        </FormConfigContext.Provider>
      )}
    </ReduxForm>
  );
};

export default EditValintapersuteetForm;
