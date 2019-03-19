import { reduxForm } from 'redux-form';
import React, { useMemo } from 'react';

import ValintaperusteForm, { validate } from '../ValintaperusteForm';
import { getValuesByValintaperuste } from '../../state/createValintaperusteForm';

const ValintapersuteetReduxForm = reduxForm({
  form: 'editValintaperusteForm',
  validate,
})(ValintaperusteForm);

const EditValintapersuteetForm = ({ valintaperuste, ...props }) => {
  const initialValues = useMemo(() => {
    return getValuesByValintaperuste(valintaperuste);
  }, [valintaperuste]);

  return (
    <ValintapersuteetReduxForm {...props} valintaperuste={valintaperuste} steps={false} canCopy={false} canEditTyyppi={false} initialValues={initialValues} />
  );
};

export default EditValintapersuteetForm;
