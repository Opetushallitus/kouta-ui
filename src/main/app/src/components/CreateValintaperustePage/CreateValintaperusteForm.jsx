import React, { useMemo } from 'react';

import ValintaperusteForm, { initialValues } from '../ValintaperusteForm';
import { getKoutaValintaperusteByOid } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import { POHJAVALINTA } from '../../constants';
import ReduxForm from '../ReduxForm';
import getFormValuesByValintaperuste from '../../utils/getFormValuesByValintaperuste';
import getValintaperusteFormConfig from '../../utils/getValintaperusteFormConfig';
import FormConfigContext from '../FormConfigContext';

const config = getValintaperusteFormConfig();

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

export const CreateValintaperusteForm = ({
  kopioValintaperusteOid,
  ...props
}) => {
  const promiseFn = kopioValintaperusteOid
    ? getKoutaValintaperusteByOid
    : resolveFn;

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
      {() => (
        <FormConfigContext.Provider value={config}>
          <ValintaperusteForm steps {...props} />
        </FormConfigContext.Provider>
      )}
    </ReduxForm>
  );
};

export default CreateValintaperusteForm;
