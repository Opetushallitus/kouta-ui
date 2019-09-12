import React, { useMemo } from 'react';

import HakuForm, { initialValues } from '../HakuForm';
import getHakuByOid from '../../utils/kouta/getHakuByOid';
import useApiAsync from '../useApiAsync';
import { POHJAVALINTA } from '../../constants';
import getFormValuesByHaku from '../../utils/getFormValuesByHaku';
import ReduxForm from '../ReduxForm';
import getHakuFormConfig from '../../utils/getHakuFormConfig';
import FormConfigContext from '../FormConfigContext';

const config = getHakuFormConfig();

const resolveFn = () => Promise.resolve();

const getCopyValues = hakuOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: hakuOid },
  },
});

const getInitialValues = haku => {
  return haku
    ? { ...getCopyValues(haku.oid), ...getFormValuesByHaku(haku) }
    : initialValues;
};

const CreateHakuForm = props => {
  const { kopioHakuOid } = props;

  const promiseFn = kopioHakuOid ? getHakuByOid : resolveFn;

  const { data } = useApiAsync({
    promiseFn,
    oid: kopioHakuOid,
    watch: kopioHakuOid,
  });

  const initialValues = useMemo(() => {
    return getInitialValues(data);
  }, [data]);

  return (
    <ReduxForm
      form="createHakuForm"
      initialValues={initialValues}
      enableReinitialize
    >
      {() => (
        <FormConfigContext.Provider value={config}>
          <HakuForm steps {...props} />
        </FormConfigContext.Provider>
      )}
    </ReduxForm>
  );
};

export default CreateHakuForm;
