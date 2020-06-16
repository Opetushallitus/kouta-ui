import React, { useMemo, useCallback } from 'react';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';

import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
  FormFooter,
} from '#/src/components/FormPage';
import ValintaperusteFormWrapper from './ValintaperusteFormWrapper';
import useSelectBase from '#/src/components/useSelectBase';
import Title from '#/src/components/Title';
import ReduxForm from '#/src/components/ReduxForm';
import { POHJAVALINTA, ENTITY } from '#/src/constants';
import getFormValuesByValintaperuste from '#/src/utils/getFormValuesByValintaperuste';
import { initialValues } from '#/src/components/ValintaperusteForm';
import getValintaperusteByOid from '#/src/utils/kouta/getValintaperusteByOid';
import useApiAsync from '#/src/components/useApiAsync';
import FormHeader from '#/src/components/FormHeader';
import FormSteps from '#/src/components/FormSteps';
import createValintaperuste from '#/src/utils/kouta/createValintaperuste';
import getValintaperusteByFormValues from '#/src/utils/getValintaperusteByFormValues';
import { useSaveValintaperuste } from '#/src/hooks/formSaveHooks';

const resolveFn = () => Promise.resolve(null);

const getCopyValues = valintaperusteOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: valintaperusteOid },
  },
});

const getInitialValues = (valintaperuste, kieliValinnat) => {
  return valintaperuste && valintaperuste.oid
    ? {
        ...getCopyValues(valintaperuste.oid),
        ...getFormValuesByValintaperuste(valintaperuste),
      }
    : initialValues(kieliValinnat);
};

const CreateValintaperustePage = props => {
  const {
    match: {
      params: { oid: luojaOrganisaatioOid, kieliValinnat },
    },
    location: { search },
    history,
  } = props;

  const { kopioValintaperusteOid = null } = queryString.parse(search);

  const selectBase = useSelectBase(history, {
    kopioParam: 'kopioValintaperusteOid',
  });

  const { t } = useTranslation();
  const promiseFn = kopioValintaperusteOid ? getValintaperusteByOid : resolveFn;

  const { data: valintaperuste } = useApiAsync({
    promiseFn,
    oid: kopioValintaperusteOid,
    watch: kopioValintaperusteOid,
  });

  const kieliValinnatLista =
    kieliValinnat == null ? [] : kieliValinnat.split(',');

  const initialValues = useMemo(() => {
    return getInitialValues(valintaperuste, kieliValinnatLista);
  }, [valintaperuste, kieliValinnatLista]);

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { id } = await createValintaperuste({
        httpClient,
        apiUrls,
        valintaperuste: {
          ...getValintaperusteByFormValues(values),
          organisaatioOid: luojaOrganisaatioOid,
        },
      });

      history.push(
        `/organisaatio/${luojaOrganisaatioOid}/valintaperusteet/${id}/muokkaus`
      );
    },
    [luojaOrganisaatioOid, history]
  );

  const FORM_NAME = 'createValintaperusteForm';

  const save = useSaveValintaperuste({ submit, formName: FORM_NAME });

  return (
    <ReduxForm form={FORM_NAME} initialValues={initialValues}>
      <Title>{t('sivuTitlet.uusiValintaperuste')}</Title>
      <FormPage
        header={<FormHeader>{t('yleiset.valintaperusteet')}</FormHeader>}
        steps={<FormSteps activeStep={ENTITY.VALINTAPERUSTE} />}
        footer={<FormFooter entity={ENTITY.VALINTAPERUSTE} save={save} />}
      >
        <RelationInfoContainer>
          <OrganisaatioRelation organisaatioOid={luojaOrganisaatioOid} />
        </RelationInfoContainer>
        <ValintaperusteFormWrapper
          steps
          organisaatioOid={luojaOrganisaatioOid}
          kopioValintaperusteOid={kopioValintaperusteOid}
          onSelectBase={selectBase}
          showArkistoituTilaOption={false}
          kieliValinnat={kieliValinnatLista}
        />
      </FormPage>
    </ReduxForm>
  );
};

export default CreateValintaperustePage;
