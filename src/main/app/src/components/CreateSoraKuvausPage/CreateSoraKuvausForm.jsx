import React, { useMemo } from 'react';

import SoraKuvausForm, { initialValues } from '../SoraKuvausForm';
import { POHJAVALINTA } from '../../constants';
import useSoraKuvaus from '../useSoraKuvaus';
import getFormValuesBySoraKuvaus from '../../utils/getFormValuesBySoraKuvaus';
import useInitialValues from '#/src/components/useInitialValues';

const getCopyValues = soraKuvausId => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: soraKuvausId },
  },
});

const getInitialValues = (soraKuvaus, kieliValinnat) => {
  return soraKuvaus && soraKuvaus.id
    ? {
        ...getCopyValues(soraKuvaus.id),
        ...getFormValuesBySoraKuvaus(soraKuvaus),
      }
    : initialValues(kieliValinnat);
};

export const CreateSoraKuvausForm = ({
  kopioSoraKuvausId,
  kieliValinnat,
  ...props
}) => {
  const { soraKuvaus } = useSoraKuvaus(kopioSoraKuvausId);
  kieliValinnat = kieliValinnat == null ? [] : kieliValinnat.split(',');

  const initialValues = useMemo(() => {
    return getInitialValues(soraKuvaus, kieliValinnat);
  }, [soraKuvaus, kieliValinnat]);

  useInitialValues(initialValues);
  return <SoraKuvausForm steps {...props} />;
};

export default CreateSoraKuvausForm;
