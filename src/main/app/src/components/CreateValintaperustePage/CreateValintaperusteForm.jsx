import React, { useMemo } from 'react';

import ValintaperusteForm, { initialValues } from '../ValintaperusteForm';
import getValintaperusteByOid from '../../utils/kouta/getValintaperusteByOid';
import useApiAsync from '../useApiAsync';
import { POHJAVALINTA } from '../../constants';
import ReduxForm from '../ReduxForm';
import getFormValuesByValintaperuste from '../../utils/getFormValuesByValintaperuste';
import getValintaperusteFormConfig from '../../utils/getValintaperusteFormConfig';
import FormConfigContext from '../FormConfigContext';
import useFieldValue from "../useFieldValue";


const resolveFn = () => Promise.resolve(null);

const getCopyValues = valintaperusteOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: valintaperusteOid },
  },
});

const getInitialValues = ( valintaperuste, kieliValinnat ) => {
  return valintaperuste && valintaperuste.oid
    ? {
        ...getCopyValues(valintaperuste.oid),
        ...getFormValuesByValintaperuste(valintaperuste),
      }
    : initialValues(kieliValinnat);
};

const ValintaperusteFormWrapper = props => {
  const { steps } = props;

  const koulutustyyppi = useFieldValue('tyyppi');

  const config = useMemo(() => getValintaperusteFormConfig(koulutustyyppi), [
    koulutustyyppi,
  ]);

  return (
    <FormConfigContext.Provider value={config}>
      <ValintaperusteForm {...props} />
    </FormConfigContext.Provider>
  );
};

export const CreateValintaperusteForm = ({
  kopioValintaperusteOid,
  kieliValinnat,
  ...props
}) => {
  const promiseFn = kopioValintaperusteOid ? getValintaperusteByOid : resolveFn;

  const { data: valintaperuste } = useApiAsync({
    promiseFn,
    oid: kopioValintaperusteOid,
    watch: kopioValintaperusteOid,
  });

  kieliValinnat = kieliValinnat == null ? [] : kieliValinnat.split(",");

  const initialValues = useMemo(() => {
    return getInitialValues(valintaperuste, kieliValinnat);
  }, [valintaperuste, kieliValinnat]);

  return (
    <ReduxForm
      form="createValintaperusteForm"
      initialValues={initialValues}
      enableReinitialize
    >
      {() => <ValintaperusteFormWrapper steps {...props} />}
    </ReduxForm>
  );
};

export default CreateValintaperusteForm;
