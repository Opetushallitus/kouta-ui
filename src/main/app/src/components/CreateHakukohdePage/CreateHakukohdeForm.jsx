import React, { useMemo } from 'react';

import HakukohdeForm, { initialValues } from '../HakukohdeForm';
import ReduxForm from '../ReduxForm';
import getHakukohdeFormConfig from '../../utils/getHakukohdeFormConfig';
import FormConfigContext from '../FormConfigContext';

const config = getHakukohdeFormConfig();

const getInitialValues = (toteutusNimi, toteutusKielet) => {
  return initialValues(toteutusNimi, toteutusKielet);
};

const CreateHakukohdeForm = props => {
  const {toteutus} = props;
  const toteutusNimi = toteutus.nimi;
  const toteutusKielet = toteutus.kielivalinta;

  const initialValues = useMemo(() => {
    return getInitialValues(toteutusNimi, toteutusKielet);
  }, [toteutusNimi, toteutusKielet]);

  return (
      <ReduxForm form="createHakukohdeForm"
                 initialValues={initialValues}
                 enableReinitialize
      >
        {() => (<FormConfigContext.Provider value={config}>
              <HakukohdeForm steps {...props} />
            </FormConfigContext.Provider>
        )}
      </ReduxForm>
  );
};

export default CreateHakukohdeForm;
