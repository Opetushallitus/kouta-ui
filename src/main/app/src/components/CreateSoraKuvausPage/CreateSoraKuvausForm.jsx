import React, { useMemo } from 'react';
import { reduxForm } from 'redux-form';

import SoraKuvausForm, { initialValues } from '../SoraKuvausForm';

import { POHJAVALINNAT } from '../../constants';
import useSoraKuvaus from '../useSoraKuvaus';

const getCopyValues = soraKuvausId => ({
  pohja: {
    tapa: POHJAVALINNAT.KOPIO,
    valinta: { value: soraKuvausId },
  },
});

const getInitialValues = soraKuvaus => {
  return soraKuvaus && soraKuvaus.id
    ? {
        ...getCopyValues(soraKuvaus.id),
      }
    : initialValues;
};

const SoraKuvausReduxForm = reduxForm({
  form: 'createSoraKuvausForm',
  initialValues,
  enableReinitialize: true,
})(SoraKuvausForm);

export const CreateSoraKuvausForm = ({ kopioSoraKuvausId, ...props }) => {
  const { soraKuvaus } = useSoraKuvaus(kopioSoraKuvausId);

  const initialValues = useMemo(() => {
    getInitialValues(soraKuvaus);
  }, [soraKuvaus]);

  return <SoraKuvausReduxForm initialValues={initialValues} steps {...props} />;
};

export default CreateSoraKuvausForm;
