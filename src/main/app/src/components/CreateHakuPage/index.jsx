import React, { useMemo, useCallback } from 'react';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';

import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
  FormFooter,
} from '#/src/components/FormPage';

import useSelectBase from '#/src/components/useSelectBase';
import Title from '#/src/components/Title';
import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/components/FormConfigContext';
import getHakuFormConfig from '#/src/utils/getHakuFormConfig';
import HakuForm, { initialValues } from '#/src/components/HakuForm';
import getHakuByOid from '#/src/utils/kouta/getHakuByOid';
import useApiAsync from '#/src/components/useApiAsync';
import { POHJAVALINTA, ENTITY } from '#/src/constants';
import getFormValuesByHaku from '#/src/utils/getFormValuesByHaku';
import createHaku from '#/src/utils/kouta/createHaku';
import getHakuByFormValues from '#/src/utils/getHakuByFormValues';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import validateHakuForm from '#/src/utils/validateHakuForm';
import FormSteps from '#/src/components/FormSteps';
import FormHeader from '#/src/components/FormHeader';

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

const CreateHakuPage = props => {
  const {
    match: {
      params: { organisaatioOid },
    },
    location: { search },
    history,
  } = props;

  const { kopioHakuOid = null } = queryString.parse(search);
  const { t } = useTranslation();
  const selectBase = useSelectBase(history, { kopioParam: 'kopioHakuOid' });

  const promiseFn = kopioHakuOid ? getHakuByOid : resolveFn;

  const { data } = useApiAsync({
    promiseFn,
    oid: kopioHakuOid,
    watch: kopioHakuOid,
  });
  const initialValues = useMemo(() => {
    return getInitialValues(data);
  }, [data]);

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { oid } = await createHaku({
        httpClient,
        apiUrls,
        haku: { ...getHakuByFormValues(values), organisaatioOid },
      });

      history.push(`/organisaatio/${organisaatioOid}/haku/${oid}/muokkaus`);
    },
    [organisaatioOid, history]
  );

  const { save } = useSaveForm({
    form: 'createHakuForm',
    submit,
    validate: validateHakuForm,
  });

  return (
    <ReduxForm form="createHakuForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.uusiHaku')}</Title>
      <FormPage
        header={<FormHeader>{t('yleiset.haku')}</FormHeader>}
        steps={<FormSteps activeStep={ENTITY.HAKU} />}
        footer={<FormFooter entity={ENTITY.HAKU} save={save} />}
      >
        <RelationInfoContainer>
          <OrganisaatioRelation organisaatioOid={organisaatioOid} />
        </RelationInfoContainer>
        <FormConfigContext.Provider value={config}>
          <HakuForm
            steps
            organisaatioOid={organisaatioOid}
            onSelectBase={selectBase}
            showArkistoituTilaOption={false}
          />
        </FormConfigContext.Provider>
      </FormPage>
    </ReduxForm>
  );
};

export default CreateHakuPage;
