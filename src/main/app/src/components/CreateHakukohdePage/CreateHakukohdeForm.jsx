import React, { useMemo } from 'react';

import HakukohdeForm, { initialValues } from '../HakukohdeForm';
import getHakukohdeFormConfig from '../../utils/getHakukohdeFormConfig';
import FormConfigContext from '../FormConfigContext';
import useInitialValues from '#/src/components/useInitialValues';

const config = getHakukohdeFormConfig();

const getInitialValues = (toteutusNimi, toteutusKielet) => {
  return initialValues(toteutusNimi, toteutusKielet);
};

const CreateHakukohdeForm = props => {
  const { toteutus } = props;
  const toteutusNimi = toteutus.nimi;
  const toteutusKielet = toteutus.kielivalinta;

  const initialValues = useMemo(() => {
    return getInitialValues(toteutusNimi, toteutusKielet);
  }, [toteutusNimi, toteutusKielet]);

  useInitialValues(initialValues);
  return (
    <FormConfigContext.Provider value={config}>
      <HakukohdeForm steps {...props} />
    </FormConfigContext.Provider>
  );
};

export default CreateHakukohdeForm;
