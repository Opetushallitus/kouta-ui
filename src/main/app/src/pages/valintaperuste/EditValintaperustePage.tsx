import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import FullSpin from '#/src/components/FullSpin';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { getFormValuesByValintaperuste } from '#/src/utils/valintaperuste/getFormValuesByValintaperuste';
import { useValintaperusteById } from '#/src/utils/valintaperuste/getValintaperusteById';

import { ValintaperusteFooter } from './ValintaperusteFooter';
import { ValintaperusteForm } from './ValintaperusteForm';

export const EditValintaperustePage = () => {
  const { organisaatioOid, id } = useParams();
  const { data: valintaperuste, isLoading } = useValintaperusteById(id);

  const { t } = useTranslation();

  const canUpdate = useCurrentUserHasRole(
    ENTITY.VALINTAPERUSTE,
    CRUD_ROLES.UPDATE,
    valintaperuste?.organisaatioOid
  );

  const initialValues = useMemo(
    () => (valintaperuste ? getFormValuesByValintaperuste(valintaperuste) : {}),
    [valintaperuste]
  );

  return isLoading ? (
    <FullSpin />
  ) : (
    <ReduxForm
      form="valintaperusteForm"
      mode={FormMode.EDIT}
      initialValues={initialValues}
      disabled={!canUpdate}
    >
      <Title>{t('sivuTitlet.valintaperusteenMuokkaus')}</Title>
      <FormPage
        readOnly={!canUpdate}
        header={
          <EntityFormHeader
            entityType={ENTITY.VALINTAPERUSTE}
            entity={valintaperuste}
          />
        }
        steps={<FormSteps activeStep={ENTITY.VALINTAPERUSTE} />}
        footer={
          valintaperuste ? (
            <ValintaperusteFooter
              formMode={FormMode.EDIT}
              organisaatioOid={organisaatioOid}
              valintaperuste={valintaperuste}
              canUpdate={canUpdate}
            />
          ) : null
        }
      >
        <RelationInfoContainer>
          <OrganisaatioRelation organisaatioOid={organisaatioOid} />
        </RelationInfoContainer>
        {valintaperuste && (
          <ValintaperusteForm
            steps={false}
            canEditTyyppi={false}
            organisaatioOid={organisaatioOid}
            valintaperuste={valintaperuste}
          />
        )}
      </FormPage>
    </ReduxForm>
  );
};
