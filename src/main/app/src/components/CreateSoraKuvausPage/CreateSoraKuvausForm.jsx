import React, { useMemo } from 'react';

import SoraKuvausForm, { initialValues } from '../SoraKuvausForm';
import ReduxForm from '../ReduxForm';
import { POHJAVALINTA } from '../../constants';
import useSoraKuvaus from '../useSoraKuvaus';
import getFormValuesBySoraKuvaus from '../../utils/getFormValuesBySoraKuvaus';

const getCopyValues = soraKuvausId => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: soraKuvausId },
  },
});

const getInitialValues = soraKuvaus => {
  return soraKuvaus && soraKuvaus.id
    ? {
        ...getCopyValues(soraKuvaus.id),
        ...getFormValuesBySoraKuvaus(soraKuvaus),
      }
    : initialValues;
};

export const CreateSoraKuvausForm = ({ kopioSoraKuvausId, ...props }) => {
  const { soraKuvaus } = useSoraKuvaus(kopioSoraKuvausId);

  const initialValues = useMemo(() => {
    return getInitialValues(soraKuvaus);
  }, [soraKuvaus]);

  return (
    <ReduxForm
      form="createSoraKuvausForm"
      initialValues={initialValues}
      enableReinitialize
    >
      {() => <SoraKuvausForm steps {...props} />}
    </ReduxForm>
  );
};

export default CreateSoraKuvausForm;
