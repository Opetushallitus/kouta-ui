import React, { useMemo } from 'react';

import ToteutusForm, { initialValues } from '../ToteutusForm';

import getFormValuesByToteutus from '../../utils/getFormValuesByToteutus';
import useApiAsync from '../useApiAsync';
import { POHJAVALINTA } from '../../constants';
import getToteutusByOid from '../../utils/kouta/getToteutusByOid';
import getToteutusFormConfig from '../../utils/getToteutusFormConfig';
import FormConfigContext from '../FormConfigContext';
import useInitialValues from '#/src/components/useInitialValues';

const resolveFn = () => Promise.resolve();

const getCopyValues = toteutusOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: toteutusOid },
  },
});

const getInitialValues = (toteutus, koulutusNimi, koulutusKielet) => {
  return toteutus
    ? { ...getCopyValues(toteutus.oid), ...getFormValuesByToteutus(toteutus) }
    : initialValues(koulutusNimi, koulutusKielet);
};

const ToteutusFormWrapper = props => {
  const { koulutustyyppi } = props;

  const config = useMemo(() => getToteutusFormConfig(koulutustyyppi), [
    koulutustyyppi,
  ]);

  return (
    <FormConfigContext.Provider value={config}>
      <ToteutusForm {...props} />
    </FormConfigContext.Provider>
  );
};

const CreateToteutusForm = props => {
  const { kopioToteutusOid } = props;
  const { koulutusNimi } = props;
  const { koulutusKielet } = props;
  const { koulutustyyppi } = props;

  const promiseFn = kopioToteutusOid ? getToteutusByOid : resolveFn;

  const { data } = useApiAsync({
    promiseFn,
    oid: kopioToteutusOid,
    watch: kopioToteutusOid,
  });

  const initialValues = useMemo(() => {
    return koulutustyyppi === 'amm'
      ? getInitialValues(data, koulutusNimi, koulutusKielet)
      : getInitialValues(data, null, koulutusKielet);
  }, [data, koulutustyyppi, koulutusNimi, koulutusKielet]);

  useInitialValues(initialValues);
  return <ToteutusFormWrapper steps {...props} />;
};

export default CreateToteutusForm;
