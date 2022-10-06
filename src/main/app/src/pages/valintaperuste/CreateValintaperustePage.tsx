import React, { useMemo } from 'react';

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
import { getFormValuesByValintaperuste } from '#/src/utils/valintaperuste/getFormValuesByValintaperuste';

import { ValintaperusteFooter } from './ValintaperusteFooter';
import { ValintaperusteForm, initialValues } from './ValintaperusteForm';

const getCopyValues = valintaperusteId => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: valintaperusteId },
  },
});

const getInitialValues = (valintaperuste, kieliValinnat, koulutustyyppi) => {
  const kieliValinnatLista =
    kieliValinnat == null ? [] : kieliValinnat.split(',');
  return valintaperuste && valintaperuste.id
    ? {
        ...getCopyValues(valintaperuste.id),
        ...getFormValuesByValintaperuste(valintaperuste, FormMode.CREATE),
      }
    : initialValues(kieliValinnatLista, koulutustyyppi);
};

export const CreateValintaperustePage = () => {
  const {
    organisaatioOid: luojaOrganisaatioOid,
    kieliValinnat,
    koulutustyyppi,
  } = useParams();

  const { t } = useTranslation();

  const { data: valintaperuste } = usePohjaEntity(ENTITY.VALINTAPERUSTE);

  const initialValues = useMemo(
    () => getInitialValues(valintaperuste, kieliValinnat, koulutustyyppi),
    [valintaperuste, kieliValinnat, koulutustyyppi]
  );

  return (
    <FormPage
      title={t('sivuTitlet.uusiValintaperuste')}
      entityType={ENTITY.VALINTAPERUSTE}
      formMode={FormMode.CREATE}
      initialValues={initialValues}
      header={<EntityFormHeader entityType={ENTITY.VALINTAPERUSTE} />}
      steps={<FormSteps activeStep={ENTITY.VALINTAPERUSTE} />}
      footer={
        <ValintaperusteFooter
          formMode={FormMode.CREATE}
          organisaatioOid={luojaOrganisaatioOid}
        />
      }
    >
      <RelationInfoContainer>
        <OrganisaatioRelation organisaatioOid={luojaOrganisaatioOid} />
      </RelationInfoContainer>
      <ValintaperusteForm steps organisaatioOid={luojaOrganisaatioOid} />
    </FormPage>
  );
};
