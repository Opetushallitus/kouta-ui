import React, { useMemo } from 'react';

import queryString from 'query-string';
import { useTranslation } from 'react-i18next';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { POHJAVALINTA, ENTITY, FormMode } from '#/src/constants';
import useSelectBase from '#/src/hooks/useSelectBase';
import getFormValuesBySoraKuvaus from '#/src/utils/soraKuvaus/getFormValuesBySoraKuvaus';
import { useSoraKuvausById } from '#/src/utils/soraKuvaus/getSoraKuvausById';

import { SoraKuvausFooter } from './SoraKuvausFooter';
import SoraKuvausForm, { initialValues } from './SoraKuvausForm';

const getCopyValues = soraKuvausId => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: soraKuvausId },
  },
});

const getInitialValues = (soraKuvaus, kieliValinnat) => {
  const kieliValinnatLista =
    kieliValinnat == null ? [] : kieliValinnat.split(',');
  return soraKuvaus && soraKuvaus.id
    ? {
        ...getCopyValues(soraKuvaus.id),
        ...getFormValuesBySoraKuvaus(soraKuvaus),
      }
    : initialValues(kieliValinnatLista);
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

  const { data: soraKuvaus } = useSoraKuvausById(kopioSoraKuvausOid);

  const initialValues = useMemo(() => {
    return getInitialValues(soraKuvaus, kieliValinnat);
  }, [soraKuvaus, kieliValinnat]);

  return (
    <ReduxForm form="soraKuvausForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.uusiSoraKuvaus')}</Title>
      <FormPage
        header={<EntityFormHeader entityType={ENTITY.SORA_KUVAUS} />}
        steps={<FormSteps activeStep={ENTITY.SORA_KUVAUS} />}
        footer={
          <SoraKuvausFooter
            formMode={FormMode.CREATE}
            soraKuvaus={{ organisaatioOid }}
          />
        }
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
    </ReduxForm>
  );
};

export default CreateSoraKuvausPage;
