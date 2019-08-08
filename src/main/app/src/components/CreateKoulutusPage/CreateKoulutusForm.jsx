import React, { useMemo } from 'react';

import KoulutusForm, { initialValues } from '../KoulutusForm';
import getFormValuesByKoulutus from '../../utils/getFormValuesByKoulutus';
import getKoulutusByOid from '../../utils/kouta/getKoulutusByOid';
import useApiAsync from '../useApiAsync';
import { POHJAVALINTA } from '../../constants';
import ReduxForm from '../ReduxForm';
import useFieldValue from '../useFieldValue';
import getKoulutusFormConfig from '../../utils/getKoulutusFormConfig';
import FormConfigContext from '../FormConfigContext';

const resolveFn = () => Promise.resolve();

const getCopyValues = koulutusOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: koulutusOid },
  },
});

const getInitialValues = koulutus => {
  return koulutus
    ? { ...getCopyValues(koulutus.oid), ...getFormValuesByKoulutus(koulutus) }
    : initialValues;
};

const KoulutusFormWrapper = props => {
  const koulutustyyppi = useFieldValue('koulutustyyppi');

  const config = useMemo(() => getKoulutusFormConfig(koulutustyyppi), [
    koulutustyyppi,
  ]);

  return (
    <FormConfigContext.Provider value={config}>
      <KoulutusForm {...props} />
    </FormConfigContext.Provider>
  );
};

const CreateKoulutusForm = props => {
  const { kopioKoulutusOid } = props;

  const promiseFn = kopioKoulutusOid ? getKoulutusByOid : resolveFn;

  const { data } = useApiAsync({
    promiseFn,
    oid: kopioKoulutusOid,
    watch: kopioKoulutusOid,
  });

  const initialValues = useMemo(() => {
    return getInitialValues(data);
  }, [data]);

  return (
    <ReduxForm
      form="createKoulutusForm"
      initialValues={initialValues}
      enableReinitialize
    >
      {() => <KoulutusFormWrapper steps {...props} />}
    </ReduxForm>
  );
};

export default CreateKoulutusForm;
