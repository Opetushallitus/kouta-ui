import React, { useMemo } from 'react';

import ValintaperusteForm from '../ValintaperusteForm';
import { getValuesByValintaperuste } from '../../state/createValintaperusteForm';
import ReduxForm from '../ReduxForm';

const EditValintapersuteetForm = ({ valintaperuste, ...props }) => {
  const initialValues = useMemo(() => {
    return getValuesByValintaperuste(valintaperuste);
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
