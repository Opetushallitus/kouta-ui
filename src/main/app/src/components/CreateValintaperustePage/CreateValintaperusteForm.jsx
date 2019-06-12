import React, { useMemo } from 'react';
import { reduxForm } from 'redux-form';

import ValintaperusteForm, { initialValues } from '../ValintaperusteForm';

import { getValuesByValintaperuste } from '../../state/createValintaperusteForm';
import { getKoutaValintaperusteByOid } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import { POHJAVALINTA } from '../../constants';

const resolveFn = () => Promise.resolve(null);

const getCopyValues = valintaperusteOid => ({
  pohja: {
    pohja: {
      tapa: POHJAVALINTA.KOPIO,
      valinta: { value: valintaperusteOid },
    },
  },
});

const getInitialValues = valintaperuste => {
  return valintaperuste && valintaperuste.oid
    ? {
        ...getCopyValues(valintaperuste.oid),
        ...getValuesByValintaperuste(valintaperuste),
      }
    : initialValues;
};

const ValintaperusteReduxForm = reduxForm({
  form: 'createValintaperusteForm',
  initialValues,
  enableReinitialize: true,
})(ValintaperusteForm);

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
    getInitialValues(valintaperuste);
  }, [valintaperuste]);

  return (
    <ValintaperusteReduxForm initialValues={initialValues} steps {...props} />
  );
};

export default CreateValintaperusteForm;
