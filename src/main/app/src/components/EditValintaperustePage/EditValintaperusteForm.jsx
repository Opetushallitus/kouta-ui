import React, { useMemo } from 'react';

import ValintaperusteForm from '../ValintaperusteForm';
import getFormValuesByValintaperuste from '../../utils/getFormValuesByValintaperuste';
import ReduxForm from '../ReduxForm';

const EditValintapersuteetForm = ({ valintaperuste, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByValintaperuste(valintaperuste);
  }, [valintaperuste]);

  return (
    <ReduxForm form="editValintaperusteForm" initialValues={initialValues}>
      {() => (
        <ValintaperusteForm
          {...props}
          valintaperuste={valintaperuste}
          steps={false}
          canCopy={false}
          canEditTyyppi={false}
        />
      )}
    </ReduxForm>
  );
};

export default EditValintapersuteetForm;
