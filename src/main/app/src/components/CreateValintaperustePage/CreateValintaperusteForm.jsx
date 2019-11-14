import React, { useMemo } from 'react';

import ValintaperusteForm, { initialValues } from '../ValintaperusteForm';
import getValintaperusteByOid from '../../utils/kouta/getValintaperusteByOid';
import useApiAsync from '../useApiAsync';
import { POHJAVALINTA } from '../../constants';
import ReduxForm from '../ReduxForm';
import getFormValuesByValintaperuste from '../../utils/getFormValuesByValintaperuste';
import getValintaperusteFormConfig from '../../utils/getValintaperusteFormConfig';
import FormConfigContext from '../FormConfigContext';


const resolveFn = () => Promise.resolve(null);

const getCopyValues = valintaperusteOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: valintaperusteOid },
  },
});

const getInitialValues = valintaperuste => {
  return valintaperuste && valintaperuste.oid
    ? {
        ...getCopyValues(valintaperuste.oid),
        ...getFormValuesByValintaperuste(valintaperuste),
      }
    : initialValues;
};

const ValintaperusteFormWrapper = props => {
  const {
    tyyppi,
    koulutustyyppi,
    steps } = props;

  const config = useMemo(() => getValintaperusteFormConfig(tyyppi), [
    tyyppi,
  ]);

  return (
    <FormConfigContext.Provider value={config}>
      <ValintaperusteForm {...props} />
    </FormConfigContext.Provider>
  );
};

export const CreateValintaperusteForm = ({
  kopioValintaperusteOid,
  ...props
}) => {
  const promiseFn = kopioValintaperusteOid ? getValintaperusteByOid : resolveFn;

  const { data: valintaperuste } = useApiAsync({
    promiseFn,
    oid: kopioValintaperusteOid,
    watch: kopioValintaperusteOid,
  });

  const initialValues = useMemo(() => {
    return getInitialValues(valintaperuste);
  }, [valintaperuste]);

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
