import React, { useMemo, useCallback } from 'react';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';

import { POHJAVALINTA, ENTITY } from '#/src/constants';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import validateKoulutusForm from '#/src/utils/validateKoulutusForm';
import getFormValuesByKoulutus from '#/src/utils/getFormValuesByKoulutus';
import getKoulutusByFormValues from '#/src/utils/getKoulutusByFormValues';
import getKoulutusByOid from '#/src/utils/kouta/getKoulutusByOid';
import createKoulutus from '#/src/utils/kouta/createKoulutus';

import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
  FormFooter,
} from '#/src/components/FormPage';
import ReduxForm from '#/src/components/ReduxForm';
import FormHeader from '#/src/components/FormHeader';
import Title from '#/src/components/Title';
import { initialValues } from '#/src/components/KoulutusForm';
import FormSteps from '#/src/components/FormSteps';
import useSelectBase from '#/src/components/useSelectBase';
import useApiAsync from '#/src/components/useApiAsync';
import KoulutusFormWrapper from './KoulutusFormWrapper';

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
      params: { oid: luojaOrganisaatioOid },
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
          organisaatioOid: luojaOrganisaatioOid,
        },
      });

      history.push(
        `/organisaatio/${luojaOrganisaatioOid}/koulutus/${oid}/muokkaus`
      );
    },
    [history, luojaOrganisaatioOid]
  );

  const FORM_NAME = 'createKoulutusForm';

  const { save } = useSaveForm({
    form: 'createKoulutusForm',
    submit,
    validate: values =>
      validateKoulutusForm({
        ...values,
        organisaatioOid: luojaOrganisaatioOid,
      }),
  });

  return (
    <ReduxForm form={FORM_NAME} initialValues={initialValues}>
      <Title>{t('sivuTitlet.uusiKoulutus')}</Title>
      <FormPage
        header={<FormHeader>{t('yleiset.koulutus')}</FormHeader>}
        steps={<FormSteps activeStep={ENTITY.KOULUTUS} />}
        footer={<FormFooter entity={ENTITY.KOULUTUS} save={save} />}
      >
        <RelationInfoContainer>
          <OrganisaatioRelation organisaatioOid={luojaOrganisaatioOid} />
        </RelationInfoContainer>
        <KoulutusFormWrapper
          steps
          isNewKoulutus={true}
          organisaatioOid={luojaOrganisaatioOid}
          kopioKoulutusOid={kopioKoulutusOid}
          onSelectBase={selectBase}
        />
      </FormPage>
    </ReduxForm>
  );
};

export default CreateKoulutusPage;
