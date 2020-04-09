import React, { useMemo } from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';
import CreateSoraKuvausHeader from './CreateSoraKuvausHeader';
import CreateSoraKuvausSteps from './CreateSoraKuvausSteps';
import CreateSoraKuvausFooter from './CreateSoraKuvausFooter';
import useSelectBase from '../useSelectBase';
import Title from '../Title';
import useTranslation from '../useTranslation';
import { POHJAVALINTA } from '#/src/constants';
import getFormValuesBySoraKuvaus from '#/src/utils/getFormValuesBySoraKuvaus';
import SoraKuvausForm, { initialValues } from '#/src/components/SoraKuvausForm';
import useSoraKuvaus from '#/src/components/useSoraKuvaus';
import ReduxForm from '#/src/components/ReduxForm';

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

  return (
    <ReduxForm
      form="createSoraKuvausForm"
      initialValues={initialValues}
      enableReinitialize
    >
      {() => (
        <>
          <Title>{t('sivuTitlet.uusiSoraKuvaus')}</Title>
          <FormPage
            header={<CreateSoraKuvausHeader />}
            steps={<CreateSoraKuvausSteps />}
            footer={
              <CreateSoraKuvausFooter organisaatioOid={organisaatioOid} />
            }
          >
            <TopInfoContainer>
              <OrganisaatioInfo organisaatioOid={organisaatioOid} />
            </TopInfoContainer>
            <SoraKuvausForm
              steps
              organisaatioOid={organisaatioOid}
              kopioSoraKuvausOid={kopioSoraKuvausOid}
              onSelectBase={selectBase}
              showArkistoituTilaOption={false}
              kieliValinnat={kieliValinnatLista}
            />
          </FormPage>
        </>
      )}
    </ReduxForm>
  );
};

export default CreateSoraKuvausPage;
