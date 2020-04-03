import React, { useMemo, useCallback, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { initialize } from 'redux-form';

import KoulutusForm from '../KoulutusForm';
import FormConfigContext from '../FormConfigContext';
import getFormValuesByKoulutus from '../../utils/getFormValuesByKoulutus';
import useFieldValue from '../useFieldValue';
import getKoulutusFormConfig from '../../utils/getKoulutusFormConfig';
import FormNameContext from '../FormNameContext';
const useFormName = () => useContext(FormNameContext);

const useInitialValues = initialValues => {
  const dispatch = useDispatch();
  const name = useFormName();
  useEffect(() => {
    dispatch(initialize(name, initialValues));
  }, [dispatch, initialValues, name]);
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

const EditKoulutusForm = ({
  onSave,
  koulutus,
  history,
  organisaatioOid,
  ...props
}) => {
  const koulutusOrganisaatioOid = koulutus.organisaatioOid;
  const initialValues = useMemo(() => {
    return getFormValuesByKoulutus(koulutus);
  }, [koulutus]);

  useInitialValues(initialValues);

  const onAttachToteutus = useCallback(() => {
    history.push(
      `/organisaatio/${organisaatioOid}/koulutus/${koulutus.oid}/toteutus`,
    );
  }, [history, koulutus]);

  return (
    <KoulutusFormWrapper
      steps={false}
      isNewKoulutus={false}
      johtaaTutkintoon={Boolean(koulutus.johtaaTutkintoon)}
      onAttachToteutus={onAttachToteutus}
      koulutus={koulutus}
      koulutusOrganisaatioOid={koulutusOrganisaatioOid}
      organisaatioOid={organisaatioOid}
      {...props}
    />
  );
};

export default withRouter(EditKoulutusForm);
