import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import { KOULUTUSTYYPPI, ENTITY, FormMode } from '#/src/constants';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import getFormValuesBySoraKuvaus from '#/src/utils/soraKuvaus/getFormValuesBySoraKuvaus';
import { useSoraKuvausById } from '#/src/utils/soraKuvaus/getSoraKuvausById';

import { SoraKuvausFooter } from './SoraKuvausFooter';
import SoraKuvausForm from './SoraKuvausForm';

export const EditSoraKuvausPage = props => {
  const { organisaatioOid, id } = useParams();

  const soraKuvausQueryResult = useSoraKuvausById(id);
  const { data: soraKuvaus } = soraKuvausQueryResult;

  const koulutustyyppi =
    soraKuvaus?.koulutustyyppi ?? KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  const { t } = useTranslation();

  const canUpdate = useIsOphVirkailija();

  const initialValues = useMemo(
    () => (soraKuvaus ? getFormValuesBySoraKuvaus(soraKuvaus) : {}),
    [soraKuvaus]
  );

  return (
    <FormPage
      title={t('sivuTitlet.soraKuvauksenMuokkaus')}
      entityType={ENTITY.SORA_KUVAUS}
      formMode={FormMode.EDIT}
      queryResult={soraKuvausQueryResult}
      initialValues={initialValues}
      readOnly={!canUpdate}
      header={
        <EntityFormHeader entityType={ENTITY.SORA_KUVAUS} entity={soraKuvaus} />
      }
      steps={<FormSteps activeStep={ENTITY.SORA_KUVAUS} />}
      footer={
        <SoraKuvausFooter
          organisaatioOid={organisaatioOid}
          formMode={FormMode.EDIT}
          soraKuvaus={soraKuvaus}
          canUpdate={canUpdate}
        />
      }
    >
      <RelationInfoContainer>
        <OrganisaatioRelation organisaatioOid={organisaatioOid} />
      </RelationInfoContainer>
      <SoraKuvausForm
        {...props}
        organisaatioOid={organisaatioOid}
        koulutustyyppi={koulutustyyppi}
        soraKuvaus={soraKuvaus}
        steps={false}
        canEditKoulutustyyppi={false}
      />
    </FormPage>
  );
};
