import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import { POHJAVALINTA, ENTITY, FormMode } from '#/src/constants';
import { usePohjaEntity } from '#/src/hooks/usePohjaEntity';
import getFormValuesBySoraKuvaus from '#/src/utils/soraKuvaus/getFormValuesBySoraKuvaus';

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
        ...getFormValuesBySoraKuvaus(_.omit(soraKuvaus, ['organisaatioOid'])),
      }
    : initialValues(kieliValinnatLista);
};

export const CreateSoraKuvausPage = () => {
  const { organisaatioOid, kieliValinnat } = useParams();
  const { t } = useTranslation();

  const { data: soraKuvaus } = usePohjaEntity(ENTITY.SORA_KUVAUS);

  const initialValues = useMemo(
    () => getInitialValues(soraKuvaus, kieliValinnat),
    [soraKuvaus, kieliValinnat]
  );

  return (
    <FormPage
      title={t('sivuTitlet.uusiSoraKuvaus')}
      entityType={ENTITY.SORA_KUVAUS}
      formMode={FormMode.CREATE}
      initialValues={initialValues}
      header={<EntityFormHeader entityType={ENTITY.SORA_KUVAUS} />}
      steps={<FormSteps activeStep={ENTITY.SORA_KUVAUS} />}
      footer={
        <SoraKuvausFooter
          organisaatioOid={organisaatioOid}
          formMode={FormMode.CREATE}
        />
      }
    >
      <RelationInfoContainer>
        <OrganisaatioRelation organisaatioOid={organisaatioOid} />
      </RelationInfoContainer>
      <SoraKuvausForm steps organisaatioOid={organisaatioOid} />
    </FormPage>
  );
};
