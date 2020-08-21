import React, { useMemo, useCallback } from 'react';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';

import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
  FormFooter,
} from '#/src/components/FormPage';
import useSelectBase from '#/src/hooks/useSelectBase';
import Title from '#/src/components/Title';
import { POHJAVALINTA, ENTITY } from '#/src/constants';
import getFormValuesBySoraKuvaus from '#/src/utils/soraKuvaus/getFormValuesBySoraKuvaus';
import SoraKuvausForm, { initialValues } from '../SoraKuvausForm';
import useSoraKuvaus from '#/src/hooks/useSoraKuvaus';
import ReduxForm from '#/src/components/ReduxForm';
import getSoraKuvausFormConfig from '#/src/utils/soraKuvaus/getSoraKuvausFormConfig';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import FormHeader from '#/src/components/FormHeader';
import FormSteps from '#/src/components/FormSteps';
import createSoraKuvaus from '#/src/utils/soraKuvaus/createSoraKuvaus';
import getSoraKuvausByFormValues from '#/src/utils/soraKuvaus/getSoraKuvausByFormValues';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import validateSoraKuvausForm from '#/src/utils/soraKuvaus/validateSoraKuvausForm';

const getCopyValues = soraKuvausId => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: soraKuvausId },
  },
});

const getInitialValues = (soraKuvaus, kieliValinnat) => {
  return soraKuvaus && soraKuvaus.id
    ? {
        ...getCopyValues(soraKuvaus.id),
        ...getFormValuesBySoraKuvaus(soraKuvaus),
      }
    : initialValues(kieliValinnat);
};

const CreateSoraKuvausPage = props => {
  const {
    match: {
      params: { organisaatioOid, kieliValinnat },
    },
    location: { search },
    history,
  } = props;

  const config = useMemo(getSoraKuvausFormConfig, []);

  const { kopioSoraKuvausOid = null } = queryString.parse(search);
  const { t } = useTranslation();
  const selectBase = useSelectBase(history, {
    kopioParam: 'kopioSoraKuvausOid',
  });

  const { soraKuvaus } = useSoraKuvaus(kopioSoraKuvausOid);
  const kieliValinnatLista =
    kieliValinnat == null ? [] : kieliValinnat.split(',');

  const initialValues = useMemo(() => {
    return getInitialValues(soraKuvaus, kieliValinnatLista);
  }, [soraKuvaus, kieliValinnatLista]);

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { id } = await createSoraKuvaus({
        httpClient,
        apiUrls,
        soraKuvaus: { ...getSoraKuvausByFormValues(values), organisaatioOid },
      });

      history.push(
        `/organisaatio/${organisaatioOid}/sora-kuvaus/${id}/muokkaus`
      );
    },
    [history, organisaatioOid]
  );

  const { save } = useSaveForm({
    form: 'createSoraKuvausForm',
    submit,
    validate: validateSoraKuvausForm,
  });

  return (
    <ReduxForm form="createSoraKuvausForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.uusiSoraKuvaus')}</Title>
      <FormConfigContext.Provider value={config}>
        <FormPage
          header={<FormHeader>{t('yleiset.soraKuvaus')}</FormHeader>}
          steps={<FormSteps activeStep={ENTITY.SORA_KUVAUS} />}
          footer={<FormFooter entity={ENTITY.SORA_KUVAUS} save={save} />}
        >
          <RelationInfoContainer>
            <OrganisaatioRelation organisaatioOid={organisaatioOid} />
          </RelationInfoContainer>
          <SoraKuvausForm
            steps
            organisaatioOid={organisaatioOid}
            onSelectBase={selectBase}
            showArkistoituTilaOption={false}
          />
        </FormPage>
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};

export default CreateSoraKuvausPage;
