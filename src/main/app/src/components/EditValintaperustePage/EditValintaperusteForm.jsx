import React, { useMemo } from 'react';

import ValintaperusteForm from '../ValintaperusteForm';
import getFormValuesByValintaperuste from '../../utils/getFormValuesByValintaperuste';
import getValintaperusteFormConfig from '../../utils/getValintaperusteFormConfig';
import FormConfigContext from '../FormConfigContext';
import useInitialValues from '#/src/components/useInitialValues';

const ValintaperusteFormWrapper = props => {
  const { koulutustyyppi } = props;

  const config = useMemo(() => getValintaperusteFormConfig(koulutustyyppi), [
    koulutustyyppi,
  ]);

  return (
    <FormConfigContext.Provider value={config}>
      <ValintaperusteForm {...props} />
    </FormConfigContext.Provider>
  );
};

const EditValintaperusteForm = ({ valintaperuste, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByValintaperuste(valintaperuste);
  }, [valintaperuste]);

  useInitialValues(initialValues);

  return (
    <ValintaperusteFormWrapper
      {...props}
      valintaperuste={valintaperuste}
      steps={false}
      canSelectBase={false}
      canEditTyyppi={false}
    />
  );
};

export default EditValintaperusteForm;
