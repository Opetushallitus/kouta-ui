import React, { useMemo, useCallback } from 'react';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';

import { POHJAVALINTA, ENTITY } from '#/src/constants';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import validateKoulutusForm from '#/src/utils/koulutus/validateKoulutusForm';
import getFormValuesByKoulutus from '#/src/utils/koulutus/getFormValuesByKoulutus';
import getKoulutusByFormValues from '#/src/utils/koulutus/getKoulutusByFormValues';
import getKoulutusByOid from '#/src/utils/koulutus/getKoulutusByOid';
import createKoulutus from '#/src/utils/koulutus/createKoulutus';

import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
  FormFooter,
} from '#/src/components/FormPage';
import ReduxForm from '#/src/components/ReduxForm';
import FormHeader from '#/src/components/FormHeader';
import Title from '#/src/components/Title';
import KoulutusForm, { initialValues } from '../KoulutusForm';
import FormSteps from '#/src/components/FormSteps';
import useSelectBase from '#/src/hooks/useSelectBase';
import useApiAsync from '#/src/hooks/useApiAsync';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useFieldValue, useEntityFormConfig } from '#/src/hooks/form';

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

const CreateKoulutusPage = props => {
  const {
    match: {
      params: { oid: valittuOrganisaatioOid },
    },
    location: { search },
    history,
  } = props;

  const selectBase = useSelectBase(history, { kopioParam: 'kopioKoulutusOid' });
  const { t } = useTranslation();

  const { kopioKoulutusOid = null } = qs.parse(search);

  const promiseFn = kopioKoulutusOid ? getKoulutusByOid : resolveFn;
  const { data } = useApiAsync({
    promiseFn,
    oid: kopioKoulutusOid,
    watch: kopioKoulutusOid,
  });
  const initialValues = useMemo(() => {
    return getInitialValues(data);
  }, [data]);

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { oid } = await createKoulutus({
        httpClient,
        apiUrls,
        koulutus: {
          ...getKoulutusByFormValues(values),
          organisaatioOid: valittuOrganisaatioOid,
        },
      });

      history.push(
        `/organisaatio/${valittuOrganisaatioOid}/koulutus/${oid}/muokkaus`
      );
    },
    [history, valittuOrganisaatioOid]
  );

  const FORM_NAME = 'createKoulutusForm';

  const { save } = useSaveForm({
    form: 'createKoulutusForm',
    submit,
    validate: values =>
      validateKoulutusForm({
        ...values,
        organisaatioOid: valittuOrganisaatioOid,
      }),
  });

  const koulutustyyppi = useFieldValue('koulutustyyppi', FORM_NAME);

  const config = useEntityFormConfig(ENTITY.KOULUTUS, koulutustyyppi);

  return (
    <ReduxForm form={FORM_NAME} initialValues={initialValues}>
      <Title>{t('sivuTitlet.uusiKoulutus')}</Title>
      <FormConfigContext.Provider value={config}>
        <FormPage
          header={<FormHeader>{t('yleiset.koulutus')}</FormHeader>}
          steps={<FormSteps activeStep={ENTITY.KOULUTUS} />}
          footer={<FormFooter entity={ENTITY.KOULUTUS} save={save} />}
        >
          <RelationInfoContainer>
            <OrganisaatioRelation organisaatioOid={valittuOrganisaatioOid} />
          </RelationInfoContainer>
          <KoulutusForm
            steps
            isNewKoulutus={true}
            organisaatioOid={valittuOrganisaatioOid}
            onSelectBase={selectBase}
          />
        </FormPage>
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};

export default CreateKoulutusPage;
